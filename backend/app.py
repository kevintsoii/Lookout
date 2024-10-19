import os, time, asyncio
import shutil
import threading
import numpy as np
import cv2
from collections import deque
from flask import Flask, request
from flask_socketio import SocketIO
from threading import Timer

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet', path='/socket')


UPLOAD_FOLDER = './uploads'
if os.path.exists(UPLOAD_FOLDER):
    shutil.rmtree(UPLOAD_FOLDER)
os.makedirs(UPLOAD_FOLDER)


frame_buffer = {}

async def gemini_call(arg):
    print(arg, 'async')

def process_buffer(camera_id):
    global frame_buffer
    if camera_id in frame_buffer:
        length = len(frame_buffer[camera_id]["frames"])
        
        if length > 0:
            frames = []
            for _ in range(length):
               frames.append(frame_buffer[camera_id]["frames"].popleft())
            
            output_video_path = f"./uploads/{camera_id}-{int(time.time())}.mp4"
            asyncio.run(gemini_call(frames))
    
    if camera_id in frame_buffer:
        timer = Timer(5, process_buffer, [camera_id])
        frame_buffer[camera_id]["timer"] = timer
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

    global frame_buffer
    if camera_id not in frame_buffer:
        frame_buffer[camera_id] = {"timer": None, "frames": deque()}
    
    np_frame = np.frombuffer(frame, dtype=np.uint8)
    img = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)
    frame_buffer[camera_id]["frames"].append(img)

    if not frame_buffer[camera_id]["timer"]:
        timer = Timer(5, process_buffer, [camera_id])
        timer.start()
        frame_buffer[camera_id]["timer"] = timer

    print(f'{camera_id} - {frame[:10]}.jpg')

if __name__ == '__main__':
    socketio.run(app, debug=True)