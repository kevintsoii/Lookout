import os
import json
import pathlib
import time
from dotenv import load_dotenv

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from uagents import Agent, Context, Model, Bureau
from uagents.query import query
from uagents.setup import fund_agent_if_low


load_dotenv()

# Gemini Config
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

def upload_file(file_path):
    video_file = genai.upload_file(path=file_path) 
    while video_file.state.name == "PROCESSING":
        time.sleep(4)
        video_file = genai.get_file(video_file.name)

    if video_file.state.name == "FAILED":
        raise ValueError(video_file.state.name)

    prompt = "In English, describe everything going on in this video in detailed paragraphs. Focus on what is going on in the surroundings, and if there are any threats, dangers, etc. "

    response = model.generate_content(
        [video_file, prompt],
        request_options={"timeout": 600},
        stream=False,
        safety_settings={
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            }
        )
    video_file.delete()
    return response.text

# Fetch AI config

class Request(Model):
    file_path: str

class Response(Model):
    text: str

video_analyzer = Agent(
    name="video_analyzer",
    seed="lookout video analyzer",
    port=5001,
    endpoint=["http://127.0.0.1:5001/submit"],
)

fund_agent_if_low(video_analyzer.wallet.address())

@video_analyzer.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {video_analyzer.name} and my address is {video_analyzer.address}.") 
    # agent1qt8r5gxe6q4pyfyg0cf0lz83g7f5zw6787y3ts0ps87qcx9uq3fg78taj5q

@video_analyzer.on_rest_post("/analysis", Request, Response)
async def handle_post(ctx: Context, req: Request) -> Response:
    ctx.logger.info(f"Video Analysis - {req.file_path}")
    response = upload_file(req.file_path)
    ctx.logger.info(f"{req.file_path} - {response[-10:]}")
    return Response(
        text=response
    )

'''
@video_analyzer.on_query(model=Request, replies={Response})
async def query_handler(ctx: Context, sender: str, _query: Request):
    file_path = _query.file_path
    ctx.logger.info(f"Received file path: {file_path}")
    resp = upload_file(file_path)
    ctx.logger.info(f"Response: {resp[:10]}")
    return Response(
        text=resp
    )
'''

bureau = Bureau(port=5001)
bureau.add(video_analyzer)

if __name__ == "__main__":
    video_analyzer.run()
