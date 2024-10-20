import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "./card";

const LogsColumn = () => {
  const [logs, setLogs] = useState([
    { _id: -1, ts: 0, severity: "clear", description: "All clear" },
  ]);

  const fetchThreatLogs = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/logs"); // Adjust API path if needed
      const data = await response.json();

      if (data && data.length > 0) {
        console.log(data);
        setLogs(data); // Replace "All clear" with actual logs if threats exist
      } else {
        setLogs([
          { _id: -1, ts: 0, severity: "clear", description: "All clear" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const deleteLogs = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/logs", {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Logs deleted successfully");
        setLogs([
          { _id: -1, ts: 0, severity: "clear", description: "All clear" },
        ]);
      } else {
        console.error("Failed to delete logs");
      }
    } catch (error) {
      console.error("Error deleting logs:", error);
    }
  };

  useEffect(() => {
    deleteLogs();
    fetchThreatLogs();
    const interval = setInterval(fetchThreatLogs, 1000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Logs</h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <Card
            key={log._id}
            className={`rounded-xl shadow-lg text-lg transition-transform transform hover:scale-105 hover:shadow-2xl ${
              log.severity === 2
                ? "border-red-500 bg-red-300"
                : log.severity === 1
                ? "border-yellow-500 bg-yellow-300"
                : "border-green-500 bg-green-300"
            }`}
          >
            <CardContent className="flex items-center p-2">
              {log.severity === 2 ? (
                <AlertTriangle className="text-red-500 mr-2" />
              ) : log.severity === 1 ? (
                <AlertCircle className="text-yellow-500 mr-2" />
              ) : (
                <CheckCircle className="text-green-500 mr-2" />
              )}
              <div className="pl-2 div flex flex-col">
                <span>{log.description}</span>
                <span className="text-gray-400 text-sm">Time: {log.ts}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LogsColumn;
