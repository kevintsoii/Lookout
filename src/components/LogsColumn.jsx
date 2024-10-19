import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./card";

const LogsColumn = ({ logs }) => {
  return (
    <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Logs</h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <Card
            key={log.id}
            className={`rounded-xl shadow-lg ${
              log.status === "danger" ? "border-red-500" : "border-green-500"
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
