import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import WebcamCapture from "./components/WebcamCapture";

function App() {
  return (
    <>
      <div>
        <WebcamCapture />
      </div>
    </>
  );
}

export default App;
