import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "./card";

const initialTimestamp = new Date().toLocaleString();

const LogsColumn = () => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(
      timestamp < 1000000000000 ? timestamp * 1000 : timestamp
    );
    return date.toLocaleString(); // Format the date to a readable string
  };

  const [logs, setLogs] = useState([
    {
      _id: -1,
      ts: initialTimestamp,
      severity: "clear",
      description: "All clear",
    },
  ]);

  const fetchThreatLogs = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/logs");
      const data = await response.json();

      if (data && data.length > 0) {
        const newLogs = data
          .filter((log) => log.severity != 0)
          .map((log) => ({
            ...log,
          }));

        setLogs(newLogs.slice(0, 10)); // Prepend new logs
      } else {
        setLogs([
          {
            _id: -1,
            ts: initialTimestamp,
            severity: "clear",
            description: "All clear",
          },
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
          {
            _id: -1,
            ts: initialTimestamp,
            severity: "clear",
            description: "All clear",
          },
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
    const interval = setInterval(fetchThreatLogs, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Logs</h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <Card
            key={log._id}
            className={`rounded-xl shadow-lg text-lg transition-transform transform hover:scale-105 hover:shadow-2xl ${
              log.severity >= 2
                ? "border-red-500 bg-red-300/75"
                : log.severity === 1
                ? "border-yellow-500 bg-yellow-300/75"
                : "border-green-500 bg-green-300/75"
            }`}
          >
            <CardContent className="flex items-center p-2 flex-shrink-0">
              <div className="flex-shrink-0">
                {log.severity >= 2 ? (
                  <AlertTriangle
                    className="text-red-500"
                    style={{ width: "24px", height: "24px" }}
                  />
                ) : log.severity === 1 ? (
                  <AlertCircle
                    className="text-yellow-500"
                    style={{ width: "24px", height: "24px" }}
                  />
                ) : (
                  <CheckCircle
                    className="text-green-500"
                    style={{ width: "24px", height: "24px" }}
                  />
                )}
              </div>
              <div className="pl-4 flex flex-col">
                <span>{log.description}</span>
                <span className="text-gray-400 text-sm">
                  {formatTimestamp(log.ts)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LogsColumn;
