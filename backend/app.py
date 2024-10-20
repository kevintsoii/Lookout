import os, time, asyncio
import shutil
import threading
import numpy as np
import requests
import cv2
from collections import deque
from threading import Timer
import json

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

from uagents.query import query
from uagents import Model
from flask_cors import CORS

from pymongo import MongoClient
from bson.json_util import dumps
from dotenv import load_dotenv


load_dotenv()

VIDEO_ANALYZER_ADDRESS = "agent1qt8r5gxe6q4pyfyg0cf0lz83g7f5zw6787y3ts0ps87qcx9uq3fg78taj5q"
PROMPT_BUILDER_ADDRESS = "agent1qt2zjzgp62m86w65af2yw8rkr749ghu8p724yztg9wvqe3srlyteuhzgedu"



app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet', path='/socket')


UPLOAD_FOLDER = './uploads'
if os.path.exists(UPLOAD_FOLDER):
    shutil.rmtree(UPLOAD_FOLDER)
os.makedirs(UPLOAD_FOLDER)


frame_buffer = {}

def gemini_call(file_path):
    try:
        requests.post(f'http://127.0.0.1:5001/analysis', json={"file_path": file_path})
        print('passed', file_path)
    except Exception as e:
        print("ERROR", e)

def process_buffer(camera_id):
    global frame_buffer
    if camera_id in frame_buffer:
        length = len(frame_buffer[camera_id]["frames"])
        
        if length > 1:
            output_video_path = f"./uploads/{camera_id}-{frame_buffer[camera_id]['updated']}.mp4"
            print(length, output_video_path)
            first_frame = frame_buffer[camera_id]["frames"][0]
            height, width, _ = first_frame.shape

            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            fps = 10
            video_writer = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

            for _ in range(length):
                frame = frame_buffer[camera_id]["frames"].popleft()
                video_writer.write(frame)

            video_writer.release()

            threading.Thread(target=gemini_call, args=(output_video_path,)).start()
    
    if camera_id in frame_buffer:
        timer = Timer(5, process_buffer, [camera_id])
        frame_buffer[camera_id]["timer"] = timer
        frame_buffer[camera_id]["updated"] = time.time()
        timer.start()

# cors
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


# sockets
@socketio.on('connect')
def handle_connect():
    client_id = request.args.get('id', "Unknown")
    print(f'{client_id}: Connected' )

@socketio.on('disconnect')
def handle_disconnect():
    client_id = request.args.get('id', "Unknown")
    print(f'{client_id}: Disonnected' )

    global frame_buffer
    if client_id in frame_buffer:
        frame_buffer[client_id]["timer"].cancel()
        del frame_buffer[client_id]

@socketio.on('end_video')
def handle_end_video(args):
    client_id = args["id"]
    print(f'{args["id"]}: Paused')

    global frame_buffer
    if client_id in frame_buffer:
        frame_buffer[client_id]["timer"].cancel()
        del frame_buffer[client_id]

@socketio.on('video_frame')
def handle_video_frame(args):
    camera_id = args["id"]
    frame = args["frame"]
    #print(f'{camera_id} - {frame[-10:]}')

    global frame_buffer
    if camera_id not in frame_buffer:
        frame_buffer[camera_id] = {"timer": None, "updated": None, "frames": deque()}
    
    np_frame = np.frombuffer(frame, dtype=np.uint8)
    img = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)
    frame_buffer[camera_id]["frames"].append(img)

    if not frame_buffer[camera_id]["timer"]:
        timer = Timer(5, process_buffer, [camera_id])
        timer.start()
        frame_buffer[camera_id]["timer"] = timer
        frame_buffer[camera_id]["updated"] = time.time()

# Features

features = []
@app.route('/features', methods=['GET', 'POST'])
def manage_features():
    global features
    if request.method == 'GET':
        return jsonify(features), 200

    if request.method == 'POST':
        data = request.json  # Expecting an array of features
        if not data or not isinstance(data, list):
            return jsonify({"error": "Invalid data format. Must be an array."}), 400
        
        features = data  # Update features list
        
        requests.post(f'http://127.0.0.1:5001/build', json={"prompt_items": features})
        return jsonify({"message": "Features updated successfully!", "features": features}), 200





# MongoDB connection
mongo_uri = os.getenv("MONGO_URI") # add your own mongo connection in .env
client = MongoClient(mongo_uri) 
db = client["lookout-database"]
logs_collection = db.logs  # Access your collection

try:
    client.server_info()  # Check if connection is successful
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# Get all logs from MongoDB
@app.route('/api/logs', methods=['GET'])
def get_log():
    logs = logs_collection.find({})
    return dumps(logs)  # dumps() to convert BSON to JSON

@app.route('/api/logs', methods=['DELETE'])
def delete_logs():
    result = logs_collection.delete_many({})  # Deletes all documents in the collection
    return {'message': f'{result.deleted_count} logs deleted.'}, 200

# Add a new user to MongoDB
@app.route('/api/logs', methods=['POST'])
def add_log():
    data = request.json  # Get data from React frontend

    ts = data["ts"]
    for feature in data:
        if feature != "ts":
            new_log = {
                "ts": ts,
                "severity": data[feature]['severity'],
                "description": data[feature]['description']
            }
            logs_collection.insert_one(new_log)
  
    return jsonify({"message": "User added successfully"}), 201













# Sample logs to demonstrate. Replace this logic with dynamic threat detection logic.
logs = [
    {"id": 1, "status": "danger", "message": "Suspicious movement detected"},
    {"id": 2, "status": "danger", "message": "Unidentified object spotted"}
]

class Request(Model):
    file_path: str


# MAIN

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5050)
    
