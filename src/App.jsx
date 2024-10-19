import { useState } from "react";
import { Video, PlusCircle } from "lucide-react";
import { Button } from "./components/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/card";
import FeatureList from "./components/FeatureList";
import LogsColumn from "./components/LogsColumn";

<<<<<<< HEAD
import WebcamSetup from "./components/webcam/WebcamSetup";

export default function Component() {
=======
export default function App() {
>>>>>>> frontend_samson
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
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">Lookout</h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <FeatureList
          features={features}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          addFeature={addFeature}
        />

        {/* Video Feed Column */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <Card className="w-full h-full flex flex-col rounded-xl">
            <CardHeader>
              <CardTitle>Live Video Feed</CardTitle>
            </CardHeader>

            <div className="custom-scrollbar overflow-x-hidden grow flex flex-col px-12 w-full text-xl justify-center items-center">
              <WebcamSetup />
            </div>
            <CardContent className="flex-grow flex items-center justify-center bg-gray-200">
              <Video className="h-32 w-32 text-gray-400" />
            </CardContent>

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
