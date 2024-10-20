import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../components/card";
import FeatureList from "../components/FeatureList";
import LogsColumn from "../components/LogsColumn";
import WebcamCapture from "../components/webcam/WebcamSetup";
import { Button } from "../components/button"; // Adjust the path if necessary
import { Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';


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
    setFeatures(features.filter(feature => feature !== featureToRemove));
  };

  const navigate = useNavigate();

  // Function to handle the button click
  const goToHomePage = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="p-4 flex justify-between items-center bg-black">
        <div className="flex items-center space-x-2">
          <Eye className="h-8 w-8 text-white" />
          <span className="text-2xl text-white font-bold">Lookout Demo</span>
        </div>
        <div className="space-x-2">
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

      <div className="flex flex-1 overflow-hidden">
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
