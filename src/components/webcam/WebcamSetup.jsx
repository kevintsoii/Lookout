import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import Webcam from "./Webcam";
import { Video } from "lucide-react";

const WebcamCapture = () => {
  /*
    Camera:
    deviceId
    label
    cameraRef
    socket
    recording
    id
  */
  const [cameras, setCameras] = useState([]);
  const [systemCameras, setSystemCameras] = useState([]);
  const [selected, setSelected] = useState({ label: "", deviceId: "" });
  const [created, setCreated] = useState(0);

  // Fetch video input devices
  useEffect(() => {
    const getCameras = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setSystemCameras(videoDevices);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getCameras();
  }, []);

  const addCamera = () => {
    const newSocket = io("http://localhost:5000", {
      path: "/socket",
      query: {
        id: created,
      },
    });

    const newCamera = {
      deviceId: selected.deviceId,
      label: selected.label || `Camera ${device.deviceId}`,
      cameraRef: React.createRef(),
      socket: newSocket,
      recording: true,
      id: created,
    };
    console.log(newCamera);

    setCameras((prevCameras) => [...prevCameras, newCamera]);
    setCreated(created + 1);
  };

  const handleSelectChange = (e) => {
    const selectedDevice = systemCameras.find(
      (device) => device.deviceId === e.target.value
    );
    setSelected({
      label: selectedDevice.label,
      deviceId: selectedDevice.deviceId,
    });
  };

  return (
    <div className="flex flex-col w-full max-h-full items-center">
      {cameras.length > 0 ? (
        cameras.map((camera, index) => (
          <Webcam key={camera.id} camera={{ ...camera, index }} />
        ))
      ) : (
        <Video className="h-32 w-32 text-gray-400 bg-gray-200 min-w-[500px] min-h-[300px]" />
      )}

      <div className="flex flex-col w-full items-center mt-4">
        <button
          className="bg-blue-200"
          onClick={addCamera}
          disabled={!selected?.deviceId}
        >
          Add Camera
        </button>
        <select
          className="mb-12 w-96"
          onChange={handleSelectChange}
          value={selected.deviceId || ""}
        >
          <option value="" disabled>
            Select a camera
          </option>
          {systemCameras.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
    </div>
    
  );
};

export default WebcamCapture;
