// Adjust the import path according to your folder structure
import { Button } from "../components/button"; // Adjust the path if necessary
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EyeBalls from "@/components/eyeball/eyeball";

export default function HomePage() {
  const navigate = useNavigate();

  // Function to handle the button click
  const goToLookoutPage = () => {
    navigate("/lookout"); // Navigate to the /lookout page
  };

  return (
    <div
      className="flex flex-col justify-between min-h-screen "
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 1)) center, radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.9)) center, radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.8)) center",
        backgroundSize: "cover",
        backgroundColor: "#262525",
      }}
    >
      <header className="flex justify-between items-center bg-black">
        <motion.header
          className="p-4 flex items-center w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <Eye className="text-white h-8 w-8" />
            <span className="text-2xl text-white font-bold">Lookout</span>
          </div>

          <div className="space-x-2 ml-auto">
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
        </motion.header>
      </header>

      <div className="relative h-1 w-full overflow-visible ">
        <div
          className="neon-line h-full bg-gradient-to-r from-slate-300/50 to-slate-500/80 animate-move-line"
          style={{
            boxShadow:
              "0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(207, 204, 204, 0.3), 0 0 30px rgba(135, 135, 135, 0.2)",
          }}
        ></div>
      </div>
      <motion.main
        className="flex flex-col items-center justify-center h-[calc(100vh-80px)] "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EyeBalls />
        <h1 className="data text-6xl font-bold text-center pt-12 pb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          Stay on the Lookout
        </h1>
        <p className="text-slate-200 text-2xl mb-8 text-center max-w-2xl">
          Protect what matters most with our advanced AI-powered surveillance
          system. Detect dangers in real-time and stay one step ahead.
        </p>

        <Button
          className="px-6 py-3 border border-transparent border-opacity-10text-l font-semibold rounded hover:bg-white hover:text-stone-600 hover:font-bold transition-all duration-200 transform hover:scale-110"
          size="lg"
          onClick={goToLookoutPage}
        >
          Try Demo
        </Button>
      </motion.main>
    </div>
  );
}
