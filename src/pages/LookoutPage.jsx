import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../components/card";
import FeatureList from "../components/FeatureList";
import LogsColumn from "../components/LogsColumn";
import WebcamCapture from "../components/webcam/WebcamSetup";
import { Button } from "../components/button"; // Adjust the path if necessary
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LookoutPage() {
  const [features, setFeatures] = useState([
    "Suspicious movement",
    "Unidentified objects",
    "Unauthorized access",
  ]);
  const [newFeature, setNewFeature] = useState("");
  const [logs] = useState([
    { id: 1, message: "All clear", status: "safe" },
    { id: 2, message: "Suspicious movement detected", status: "danger" },
    { id: 3, message: "Unidentified object spotted", status: "danger" },
  ]);

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature]);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const navigate = useNavigate();

  // Function to handle the button click
  const goToHomePage = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-400"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 1)) center, radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.9)) center, radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.8)) center",
        backgroundSize: "cover",
        backgroundColor: "#262525",
      }}
    >
      <motion.header
        className="fixed w-full flex justify-between items-center backdrop-blur-md bg-black z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {" "}
        <header className="p-4 flex items-center w-full border-b border-gray-600 ">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-white" />
            <span className="text-2xl text-white font-bold">Lookout</span>
          </div>
          <div className="space-x-2 ml-auto">
            <Button
              variant="outline"
              className="px-6 py-3 bg-primary-foreground rounded font-semibold hover:bg-white hover:text-stone-900 hover:font-bold transition-all duration-200 transform hover:scale-110"
              onClick={goToHomePage}
            >
              Home
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 bg-primary-foreground rounded font-semibold hover:bg-white hover:text-stone-900 hover:font-bold transition-all duration-200 transform hover:scale-110"
            >
              Sign Up
            </Button>
          </div>
        </header>
      </motion.header>

      <div className="flex flex-1 overflow-hidden p-2 mt-20">
        <FeatureList
          features={features}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          addFeature={addFeature}
          removeFeature={removeFeature}
        />

        <div className="w-1/2 p-4 overflow-y-auto rounded-md">
          <Card className="w-full h-full flex flex-col rounded-xl ">
            <CardHeader>
              <CardTitle>Live Video Feed</CardTitle>
            </CardHeader>

            <div className="custom-scrollbar overflow-x-hidden grow flex flex-col px-12 w-full text-xl justify-center items-center rounded-md">
              <WebcamCapture />
            </div>
          </Card>
        </div>

        <LogsColumn logs={logs} />
      </div>
    </div>
  );
}
