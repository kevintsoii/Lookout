import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "../components/card";
import FeatureList from "../components/FeatureList";
import LogsColumn from "../components/LogsColumn";
import WebcamCapture from "../components/webcam/WebcamSetup";
import { Button } from "../components/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LookoutPage() {
  const [features, setFeatures] = useState(["Weapons", "Violence", "Theft"]);
  const [newFeature, setNewFeature] = useState("");
  const [logs] = useState([
    { _id: 1, severity: 0, description: "All clear" },
    { _id: 2, severity: 2, description: "Suspicious movement detected" },
    { _id: 3, severity: 2, description: "Unidentified object spotted"},
  ]);

  // FEATURE LIST FUNCTIONS
  const sendFeatures = (featuresToSend) => {
    // Sending data to Flask API
    axios
      .post("http://127.0.0.1:5050/features", featuresToSend)
      .then((response) => {
        console.log("Response from server:", response.data);
      })
      .catch((error) => {
        console.error("There was an error sending features!", error);
      });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...features, newFeature];
      setFeatures(updatedFeatures);
      setNewFeature("");
      sendFeatures(updatedFeatures); // Send updated features
    }
  };

  const removeFeature = (featureToRemove) => {
    const updatedFeatures = features.filter(
      (feature) => feature !== featureToRemove
    );
    setFeatures(updatedFeatures);
    sendFeatures(updatedFeatures); // Send updated features
  };

  // PAGE NAVIGATION
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/"); // Navigate to the home page
  };

  // TIME

  const [currentTime, setCurrentTime] = useState("");

  const updateTime = () => {
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      timeZoneName: "short",
    };
    const formattedTime = now.toLocaleString("en-US", options);
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    /*// Fetch the feature list from the Flask backend on component mount 
    axios
      .get("http://127.0.0.1:5050/features") // Adjust the URL if necessary
      .then((response) => {
        setFeatures(response.data); // Set the fetched features to the state
      })
      .catch((error) => {
        console.error("There was an error fetching the feature list!", error);
      }); */

    // Set interval to update the time every second
    sendFeatures(features);

    updateTime(); // Initial time set
    const timer = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="p-4 flex justify-between items-center bg-black">
        <div className="flex items-center space-x-2">
          <Eye className="h-8 w-8 text-white" />
          <span className="text-2xl text-white font-bold">Lookout</span>
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

      <div className="flex flex-1 overflow-hidden p-2">
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
            <div className="my-2 text-base font-semibold text-red-800/70 flex justify-center items-center">
              {currentTime}
            </div>

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
