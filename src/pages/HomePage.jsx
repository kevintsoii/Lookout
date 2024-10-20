// Adjust the import path according to your folder structure
import { Button } from "../components/button"; // Adjust the path if necessary
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  // Function to handle the button click
  const goToLookoutPage = () => {
    navigate("/lookout"); // Navigate to the /lookout page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-200 to-gray-700 text-primary-foreground">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Eye className="h-8 w-8" />
          <span className="text-2xl font-bold">Lookout</span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="px-6 py-3 bg-primary-foreground text-primary rounded font-semibold hover:bg-white hover:text-stone-900 hover:font-bold transition-all duration-300 transform hover:scale-110"
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="px-6 py-3 bg-primary-foreground text-primary rounded font-semibold hover:bg-white hover:text-stone-900 hover:font-bold transition-all duration-300 transform hover:scale-110"
          >
            Sign Up
          </Button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <h1 className="text-6xl font-bold mb-8 text-center">
          {" "}
          Stay on the Lookout{" "}
        </h1>
        <p className="text-2xl mb-8 text-center max-w-2xl">
          Protect what matters most with our advanced AI-powered surveillance
          system. Detect dangers in real-time and stay one step ahead.
        </p>
        <Button
          className="px-7 py-4 bg-primary-foreground text-l font-semibold rounded hover:bg-white hover:text-stone-600 hover:font-bold transition-all duration-200 transform hover:scale-110"
          size="lg"
          onClick={goToLookoutPage}
        >
          Try Demo
        </Button>
      </main>
    </div>
  );
}
