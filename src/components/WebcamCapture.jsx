import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import io from "socket.io-client";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection when component mounts
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Cleanup on unmount
    return () => newSocket.close();
  }, []);

  const startRecording = () => {
    setRecording(true);
    captureFrames();
  };

  const stopRecording = () => {
    setRecording(false);
    if (socket) socket.emit("end_video");
  };

  const captureFrames = async () => {
    if (!webcamRef.current || !recording) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc && socket) {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      socket.emit("video_frame", blob);  // Send frame to backend
    }

    // Capture the next frame after a short delay
    setTimeout(captureFrames, 100);  // Adjust for frame rate
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <div>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
    </div>
  );
};

export default WebcamCapture;