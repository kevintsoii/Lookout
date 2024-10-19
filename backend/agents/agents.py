import os
import json
import pathlib
import time
from dotenv import load_dotenv

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from uagents import Agent, Context, Model
from uagents.query import query
from uagents.setup import fund_agent_if_low



load_dotenv()

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
    print(response.text)

upload_file(r'C:\Users\KT149\Desktop\Lookout\uploads\0-1729380615.8811345.mp4')

input()




class Request(Model):
    query: str

class Response(Model):
    response: str


# video_protocol = VideoProtocol()
video_agent = Agent(
    name="video_agent",
    seed="sending video to gemini",
    endpoint="http://localhost:5173",
)
                    


fund_agent_if_low(video_agent.wallet.address())

@video_agent.on_event("startup")
async def agent_details(ctx: Context):
    ctx.logger.info(f"Video Agent Address is {video_agent.address}")

@video_agent.on_query(model=Request, replies={Response})
async def query_handler(ctx: Context, sender: str, _query: Request):
    file_path = _query.file_path
    ctx.logger.info("Received file path: {file_path}")
    ctx.logger.info("File path is: {file_path}")
    send_video_to_api(file_path)

if __name__ == "__main__":
    video_agent.run()