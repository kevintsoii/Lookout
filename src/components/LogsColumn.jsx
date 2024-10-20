import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./card";

const LogsColumn = () => {
  const [logs, setLogs] = useState([{ id: 0, status: "clear", message: "All clear" }]);

  const fetchThreatLogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logs"); // Adjust API path if needed
      const data = await response.json();

      if (data && data.length > 0) {
        setLogs(data); // Replace "All clear" with actual logs if threats exist
      } else {
        setLogs([{ id: 0, status: "clear", message: "All clear" }]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchThreatLogs();
    const interval = setInterval(fetchThreatLogs, 10000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Logs</h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <Card
            key={log.id}
            className={`rounded-xl shadow-lg text-lg transition-transform transform hover:scale-105 hover:shadow-2xl ${
              log.status === "danger"
                ? "border-red-500 bg-red-300"
                : "border-green-500 bg-green-300"
            }`}
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
  );
};

export default LogsColumn;

