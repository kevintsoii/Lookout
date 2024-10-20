import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Webcam from "./Webcam";
import { Video, PlusCircle } from "lucide-react";
import { Button } from "../button";

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
      label: selected.label || `Camera ${selected.deviceId}`,
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
    <div className="relative flex flex-col w-full min-h-full py-6 max-h-full items-center">
      {cameras.length > 0 ? (
        cameras.map((camera, index) => (
          <Webcam key={camera.id} camera={{ ...camera, index }} />
        ))
      ) : (
        <div className="h-12 w-12 text-gray-400 bg-gray-300 min-w-[500px] min-h-[300px] items-center justify-center flex">
          <Video size={175} />
        </div>
      )}

      <div className=" sticky  bottom-0 left-0 pt-3 border-gray-500 bg-gray-200 flex flex-col w-full items-center mt-4 gap-3">
        <select
          className="rounded-xl bg-white border-gray-500 py-2 pl-2 w-full"
          onChange={handleSelectChange}
          value={selected.deviceId || ""}
        >
          <option className="text-gray-200" value="" disabled>
            Select a camera
          </option>
          {systemCameras.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>

        <Button
          className="w-full flex items-center justify-center text-xl border active:scale-95 rounded-full bg-gradient-to-br from-gray-800 to-black backdrop-blur-lg shadow-lg  border-gray-200 hover:text-white hover:border-gray-900 mb-4"
          onClick={addCamera}
          disabled={!selected?.deviceId}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          <span>Add Camera</span>
        </Button>
      </div>
    </div>
  );
};

export default WebcamCapture;
