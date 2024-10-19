import React from "react";
import ReactWebcam from "react-webcam";

const Webcam = ({ camera }) => {
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

  return (
    <div className="flex flex-col min-w-full max-h-[70%] items-center px-[15%] py-6">
      {camera.recording && (
        <div className="flex flex-col h-full w-full bg-gray-200 px-[3%] py-[3%] gap-3">
          <div className="flex justify-between">
            <h1 className="self-start font-medium text-xl ">{camera.label}</h1>
            <div>
              <button onClick={() => startRecording(camera)}>Start</button>
              <button onClick={() => stopRecording(camera)}>Stop</button>
            </div>
          </div>
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
        </div>
      )}
    </div>
  );
};

export default Webcam;
