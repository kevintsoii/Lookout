import { useState } from "react";
import { Video, PlusCircle } from "lucide-react";
import { Button } from "./components/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/card";
import FeatureList from "./components/FeatureList";
import LogsColumn from "./components/LogsColumn";

import WebcamSetup from "./components/webcam/WebcamSetup";

export default function App() {
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-black text-primary-foreground p-4 shadow-md">
        <h1 className="text-3xl text-white font-bold text-center">Lookout</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <FeatureList
          features={features}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          addFeature={addFeature}
        />

        <div className="w-1/2 p-4 overflow-y-auto">
          <Card className="w-full h-full flex flex-col rounded-xl">
            <CardHeader>
              <CardTitle>Live Video Feed</CardTitle>
            </CardHeader>

            <div className="custom-scrollbar overflow-x-hidden grow flex flex-col px-12 w-full text-xl justify-center items-center">
              <WebcamSetup />
            </div>

            <div className="p-3">
              <Button className="w-full flex items-center justify-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                <span className="text-xl">Add Camera</span>
              </Button>
            </div>
          </Card>
        </div>

        <LogsColumn logs={logs} />
      </div>
    </div>
  );
}
