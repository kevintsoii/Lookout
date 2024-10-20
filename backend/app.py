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
from flask_socketio import SocketIO

from uagents.query import query
from uagents import Model


VIDEO_ANALYZER_ADDRESS = "agent1qt8r5gxe6q4pyfyg0cf0lz83g7f5zw6787y3ts0ps87qcx9uq3fg78taj5q"



app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet', path='/socket')


UPLOAD_FOLDER = './uploads'
#if os.path.exists(UPLOAD_FOLDER):
#    shutil.rmtree(UPLOAD_FOLDER)
#os.makedirs(UPLOAD_FOLDER)


frame_buffer = {}

async def gemini_call(arg):
    print(arg, 'async')

def process_buffer(camera_id):
    global frame_buffer
    if camera_id in frame_buffer:
        length = len(frame_buffer[camera_id]["frames"])
        
        if length > 1:
            output_video_path = f"./uploads/{camera_id}-{frame_buffer[camera_id]['updated']}.mp4"
            first_frame = frame_buffer[camera_id]["frames"][0]
            height, width, _ = first_frame.shape

            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            fps = 10
            video_writer = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

            for _ in range(length):
                frame = frame_buffer[camera_id]["frames"].popleft()
                video_writer.write(frame)

            video_writer.release()

            asyncio.run(gemini_call(output_video_path))
    
    if camera_id in frame_buffer:
        timer = Timer(5, process_buffer, [camera_id])
        frame_buffer[camera_id]["timer"] = timer
        frame_buffer[camera_id]["updated"] = time.time()
        timer.start()


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
    print(f'{camera_id} - {frame[:10]}')

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



class Request(Model):
    file_path: str

@app.route("/test", methods=["GET"])
async def test():
    return requests.post('http://localhost:5001/analysis', json={"file_path": r"backend\0-1729384806.5118058.mp4"}).text



# MAIN

if __name__ == '__main__':
    socketio.run(app, debug=True)
