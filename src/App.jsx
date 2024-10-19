import { useState } from "react";
import { PlusCircle, AlertTriangle, CheckCircle, Video } from "lucide-react";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/card";
import "./App.css";

export default function Component() {
  const [features, setFeatures] = useState([
    "Suspicious movement",
    "Unidentified objects",
    "Unauthorized access",
  ]);
  const [newFeature, setNewFeature] = useState("");
  const [logs, setLogs] = useState([
    { id: 1, message: "All clear", status: "safe" },
    { id: 2, message: "Suspicious movement detected", status: "danger" },
    { id: 3, message: "Unidentified object spotted", status: "danger" },
  ]);

  const addFeature = () => {
    if (newFeature) {
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
        {/* Features Column */}
        <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-2 mb-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <AlertTriangle className="text-yellow-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="New feature"
            />
            <Button onClick={addFeature}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        {/* Video Feed Column */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <Card className="w-full h-full flex flex-col">
            <CardHeader>
              <CardTitle>Live Video Feed</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center bg-gray-200">
              <Video className="h-32 w-32 text-gray-400" />
            </CardContent>
            <div className="p-4">
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Camera
              </Button>
            </div>
          </Card>
        </div>

        {/* Logs Column */}
        <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Logs</h2>
          <div className="space-y-2">
            {logs.map((log) => (
              <Card
                key={log.id}
                className={
                  log.status === "danger"
                    ? "border-red-500"
                    : "border-green-500"
                }
              >
                <CardContent className="flex items-center p-2">
                  {log.status === "danger" ? (
                    <AlertTriangle className="text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="text-green-500 mr-2" />
                  )}
                  <span>{log.message}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
