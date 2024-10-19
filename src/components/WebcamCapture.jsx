import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import io from "socket.io-client";

const WebcamCapture = () => {
  /*
    Camera:
    id
    deviceId
    cameraRef
    socket
    recording
  */
  const [cameras, setCameras] = useState([]);

  const [systemCameras, setSystemCameras] = useState([]);
  const [selected, setSelected] = useState("");

  // Fetch video input devices
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setSystemCameras(videoDevices);
    });
  }, []);

  const startRecording = (camera) => {
    camera.recording = true;
    captureFrames(camera);
  };

  const stopRecording = (camera) => {
    camera.recording = false;
    if (camera.socket) camera.socket.emit("end_video");
  };

  const captureFrames = async (camera) => {
    if (!camera.webcamRef.current || !camera.recording) return;

    const imageSrc = camera.webcamRef.current.getScreenshot();
    if (imageSrc && camera.socket) {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      camera.socket.emit("video_frame", blob);
    }

    setTimeout(() => captureFrames(camera), 100);
  };

  const addCamera = () => {
    const newSocket = io("http://localhost:5000", {
      path: "/socket", // Customize for each socket if needed
    });

    const newCamera = {
      id: cameras.length,
      deviceId: selected,
      cameraRef: React.createRef(),
      socket: newSocket,
      recording: false,
    };

    setCameras((prevCameras) => [...prevCameras, newCamera]);
  };

  return (
    <div>
      <h1>Multiple Webcam Capture</h1>

      {/* Dropdown to select video input device */}
      <select onChange={(e) => setSelected(e.target.value)} value={selected}>
        <option value="">Select Camera</option>
        {systemCameras.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      <button onClick={addCamera} disabled={!selected}>
        Add Camera
      </button>

      <div>
        {cameras.map((camera, index) => (
          <div key={camera.id} style={{ margin: "20px" }}>
            <Webcam
              audio={false}
              ref={camera.webcamRef}
              videoConstraints={{
                deviceId: camera.deviceId
                  ? { exact: camera.deviceId }
                  : undefined,
              }}
              screenshotFormat="image/jpeg"
            />
            <div>
              <button onClick={() => startRecording(camera)}>
                Start Recording
              </button>
              <button onClick={() => stopRecording(camera)}>
                Stop Recording
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebcamCapture;
