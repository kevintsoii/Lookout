from flask import Flask
from flask_socketio import SocketIO
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('video_frame')
def handle_video_frame(data):
    print(data)
    frame_name = os.path.join(UPLOAD_FOLDER, 'frame.jpg')
    with open(frame_name, 'wb') as f:
        f.write(data)
    print(f"Frame saved as {frame_name}")

@socketio.on('end_video')
def handle_end_video():
    print('Video transmission ended')

if __name__ == '__main__':
    socketio.run(app, debug=True)