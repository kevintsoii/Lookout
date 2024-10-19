import React, { useState, useEffect } from "react";
import ReactWebcam from "react-webcam";

const Webcam = ({ camera }) => {
  const [recording, setRecording] = useState(camera.recording);

  useEffect(() => {
    startRecording(camera);
  }, []);

  const startRecording = (camera) => {
    camera.recording = true;
    setRecording(camera.recording);
    captureFrames(camera);
  };

  const stopRecording = (camera) => {
    camera.recording = false;
    setRecording(camera.recording);
  };

  const captureFrames = async (camera) => {
    if (!camera.cameraRef.current || !camera.recording) return;

    const imageSrc = camera.cameraRef.current.getScreenshot();
    if (imageSrc && camera.socket) {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const arrayBuffer = await blob.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);
      camera.socket.emit("video_frame", {
        frame: byteArray,
        id: camera.id,
        timestamp: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      });
    }

    setTimeout(() => captureFrames(camera), 100);
  };

  return (
    <div className="flex flex-col min-w-full max-h-[70%] items-center px-[15%] py-6">
      <div className="flex flex-col h-full w-full bg-gray-200 px-[3%] py-[3%] gap-3">
        <div className="flex justify-between">
          <h1 className="self-start font-medium text-xl ">{camera.label}</h1>
          <div>
            {recording ? (
              <button onClick={() => stopRecording(camera)}>
                {/* Stop button */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="red"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle-stop"
                >
                  <circle cx="12" cy="12" r="10" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                </svg>
              </button>
            ) : (
              <button onClick={() => startRecording(camera)}>
                {/* start button */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="green"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle-play"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {recording && (
          <ReactWebcam
            className="flex max-h-[90%]"
            audio={false}
            ref={camera.cameraRef}
            videoConstraints={{
              deviceId: camera.deviceId
                ? { exact: camera.deviceId }
                : undefined,
            }}
            screenshotFormat="image/jpeg"
          />
        )}
      </div>
    </div>
  );
};

export default Webcam;
