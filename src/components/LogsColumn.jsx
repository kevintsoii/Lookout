import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./card";

const LogsColumn = ({ logs }) => {
  return (
    <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Logs</h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <Card
          key={log.id}
          className={`rounded-xl shadow-lg text-lg transition-transform transform hover:scale-105 hover:shadow-2xl ${
            log.status === "danger"
              ? "border-red-500 bg-red-50"
              : "border-green-500 bg-green-50"
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
