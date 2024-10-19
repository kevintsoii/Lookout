import React, { useState, useEffect } from "react";
import ReactWebcam from "react-webcam";

const Webcam = ({ camera }) => {
  const [recording, setRecording] = useState(camera.recording);

  useEffect(() => {
    if (recording) {
      captureFrames(camera);
    }
  }, [recording]);

  const startRecording = (camera) => {
    camera.recording = true;
    setRecording(camera.recording);
  };

  const stopRecording = (camera) => {
    camera.recording = false;
    setRecording(camera.recording);
  };

  const captureFrames = async (camera, fps = 10) => {
    if (!camera.cameraRef.current || !camera.recording) return;

    const frameInterval = 1000 / fps;

    const captureAndSendFrame = async () => {
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
        console.log("Frame sent");
      }
    };

    let lastFrameTime = Date.now();

    const sendFrameLoop = () => {
      if (!camera.recording) return;

      const now = Date.now();
      const elapsedTime = now - lastFrameTime;

      // Adjust next frame timing to maintain consistent FPS
      if (elapsedTime >= frameInterval) {
        lastFrameTime = now;
        captureAndSendFrame();
      }

      // Schedule the next frame with a delay to compensate for processing time
      setTimeout(
        sendFrameLoop,
        Math.max(0, frameInterval - (Date.now() - lastFrameTime))
      );
    };

    sendFrameLoop();
  };

  return (
    <div className="flex flex-col min-w-full max-h-[70%] items-center px-[15%] py-6">
      <div className="flex flex-col h-full w-full bg-gray-200 px-[3%] py-[3%] gap-3">
        <div className="flex justify-between">
          <h1 className="self-start font-medium text-xl ">{camera.label}</h1>
          <div>
            <button onClick={() => startRecording(camera)}>Start</button>
            <button onClick={() => stopRecording(camera)}>Stop</button>
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
