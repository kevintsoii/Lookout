from datetime import datetime
import os, asyncio
import json
import pathlib
import time, requests
from dotenv import load_dotenv

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from uagents import Agent, Context, Model, Bureau
from uagents.query import query
from uagents.setup import fund_agent_if_low


current_prompt = ""

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

async def upload_file(prompt, file_path):
    video_file = genai.upload_file(path=file_path) 
    while video_file.state.name == "PROCESSING":
        await asyncio.sleep(0.5)
        video_file = genai.get_file(video_file.name)

    if video_file.state.name == "FAILED":
        raise ValueError(video_file.state.name)    

    response = model.generate_content(
        [video_file, prompt],
        request_options={"timeout": 600},
        stream=False,
        safety_settings={
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE
            }
        )
    video_file.delete()

    return response.text.replace('```json','').replace('```','').strip()

def create_prompt(old_prompt, prompt_items):
    response = model.generate_content("You are an AI prompt builder for a security camera surveillance system. Your job is to return an updated prompt to make an AI video camera  analyze security camera footage provided as a mp4 and make sure it is aware of its role. You will be given a list of irregularities (items or situations) to detect, such as fire or weapons. Given an old prompt, create a new prompt consisting of only the irregularities listed so that the AI will return a dictionary containing keys of irregularities that are present in the video, and other wise if there is no irregularity, return an empty dictionary. If it can't be determined then return empty dictionary. It will only return a dictionary text and nothing else. Dictionary entries should contain the irregularity as key, and the value should contain another dictionary with severity of 1 or 2 (highest) and a short description of what and where it is happening. For each irregularity also give a brief explanation to help the camera system. Here is the old prompt: <" + old_prompt + ">. Here is the list of items or situations, ignore any non-english words: " + str(prompt_items))
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

class BuildRequest(Model):
    prompt_items: list

class BuildResponse(Model):
    result: str

prompt_builder = Agent(
    name="prompt_builder",
    seed="lookout prompt builder",
    port=5001,
    endpoint=["http://127.0.0.1:5001/submit"],
)

fund_agent_if_low(prompt_builder.wallet.address())

# Fetch AI methods

@video_analyzer.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {video_analyzer.name} and my address is {video_analyzer.address}.") 
    # agent1qt8r5gxe6q4pyfyg0cf0lz83g7f5zw6787y3ts0ps87qcx9uq3fg78taj5q


@prompt_builder.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {prompt_builder.name} and my address is {prompt_builder.address}.") 
    global current_prompt
    current_prompt = "You are an AI security camera surveillance system. Your job is to analyze the video footage provided and describe all instances of irregularities (items or situations) that you detect if they fall under a given list. The list of items or situations to detect are: weapons (anything related guns, knives, long sticks, and more), violence (anything related to aggressive actions between two individuals), and theft (anything related to breaking in or stealing items). You will always return only a JSON object (dictionary). The dictionary will contain irregularities that are present as keys, and if no irregularity is present an empty dictionary. If there is nothing in the video or you can't determine, return empty dictionary. Dictionary entries should contain the irregularity as key, and the value should contain another dictionary with severity of 1 or 2 (highest) and a short description of what and where it is happening. "

@video_analyzer.on_rest_post("/analysis", Request, Response)
async def analyze_video(ctx: Context, req: Request) -> Response:
    ts = int(req.file_path.split('-')[-1].split('.')[0])
    date_str = datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    start = time.ctime()

    response = await upload_file(current_prompt, req.file_path)
    ctx.logger.info(f"Video Analysis - {start} starting on video from {date_str} end at {time.ctime()}")
    
    try: response_json = json.loads(response)
    except: response_json = {}


    
    print(date_str, response_json)

    if response_json:
        response_json["ts"] = ts
        requests.post('http://localhost:5050/api/logs', json=response_json)

    return Response(
        text=response
    )

@video_analyzer.on_rest_post("/build", BuildRequest, BuildResponse)
async def analyze_video(ctx: Context, req: BuildRequest) -> BuildResponse:
    ctx.logger.info(f"Prompt Builder - {req.prompt_items}")
    global current_prompt
    response = create_prompt(current_prompt, req.prompt_items)
    current_prompt = response
    print(current_prompt)
    return BuildResponse(
        result=response
    )

'''
@prompt_builder.on_query(model=BuildRequest, replies={BuildResponse})
async def build_prompt(ctx: Context, sender: str, _query: BuildRequest) -> BuildResponse:
    ctx.logger.info(f"Prompt Builder - {_query.prompt_items}")
    response = create_prompt(ctx.storage.get("prompt", _query.prompt_items))
    ctx.storage.set("prompt", response)
    ctx.logger.info(f"{_query.prompt_items} - {response[-10:]}")
    return BuildResponse(
        result=response
    )
'''

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
bureau.add(prompt_builder)

if __name__ == "__main__":
    bureau.run()
