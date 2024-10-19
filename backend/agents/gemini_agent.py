from uagents import Agent, Context
import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
import pathlib
import time


load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

# Function to upload file data
def upload_file_data(file_data):
    mime_type = file_data["mime_type"]
    
    if name := file_data.get("filename", None):
        if not pathlib.Path(name).exists():
            raise IOError(
                f"Local file: `{name}` does not exist."
            )
        print("Uploading local file:", name)
        file_info = genai.upload_file(path=name, display_name=name, mime_type=mime_type)
        if file_info and file_info.uri:
            file_data["file_uri"] = file_info.uri
            print("Waiting for file to become active...")
            time.sleep(2)
        else:
            raise ValueError("File upload failed. No URI returned.")
    
# function to create specific prompt; values = features that user specified to look out for
# might have to change to update_prompt later on in during agent development, include a default prompt variable
# need to add retrieving the features list using flask
def get_prompt(values: list):
    prompt = 'Return one specific version of this prompt based on this current prompt: "You are an AI camera, report if there is any {}."'.format(
        ", ".join(values) if values else "none"
    )
    prompt += "Make note of where these incidents occur. Please make sure to return only the prompt."

    # Initialize the generative model
    gemini = genai.GenerativeModel("gemini-1.5-flash")

    generation_config = {
        "temperature": 0.3,
        "top_p": 0.9,
        "top_k": 50,
        "max_output_tokens": 150,
        "response_mime_type": "text/plain",
    }


    # Generate the more specific prompt using the model
    response = gemini.generate_content(
        prompt, 
        generation_config= generation_config, 
        safety_settings={},
        stream=False,)
    generated_prompt = ""
    for candidate in response.candidates:
        generated_prompt += candidate.content.parts[0].text

    return generated_prompt
    
    

def send_video_to_api():

    file_data = {
        "filename": "/Users/marvinzhai/Desktop/videos/threat.mp4" ,
        "mime_type": "video/mp4"
    }

    # Upload function to convert file 
    upload_file_data(file_data)

    if "file_uri" not in file_data or not file_data["file_uri"]:
        raise ValueError("File upload failed. No file_uri returned.")
    

    # Create the gemini model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    # Prepare the content with the video and prompt
    contents = [{
        "role": "user",
        "parts": [
            {"text": "In English, describe everything going on in this video in detailed paragraphs. Focus on what is going on in the surroundings, and if there are any threats, dangers, etc. "},
            {"file_data": {"file_uri": file_data["file_uri"]}} 
        ]
    }]

    # Call the model and pass the contents
    gemini = genai.GenerativeModel(model_name="gemini-1.5-flash")

    response = gemini.generate_content(
        contents,
        generation_config=generation_config,
        safety_settings={},
        stream=False,
    )

    for candidate in response.candidates:
        print(candidate.content.parts[0].text)

        

    # with open('gemini_response.json','w') as response_file:
    #     json.dump(response_text, response_file)
 
  

# send_video_to_api()

get_prompt(["fire", "gun", "suspicious people"])


#video_agent = Agent(name="video_agent")


#@video_agent.on_interval(period=1.0)