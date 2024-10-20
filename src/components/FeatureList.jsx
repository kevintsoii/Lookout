import { AlertTriangle, PlusCircle, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { AnimatePresence, motion } from "framer-motion";

const FeatureList = ({
  features,
  newFeature,
  setNewFeature,
  addFeature,
  removeFeature,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addFeature();
    }
  };
  return (
    <div className="w-1/4 p-4 overflow-y-auto flex flex-col rounded-xl bg-gradient-to-br from-black to-gray-900 backdrop-blur-lg shadow-lg border border-gray-700 ">
      <div class="absolute inset-0 rounded-xl border-[1px] border-transparent bg-gradient-to-br from-white/10 to-transparent opacity-10 blur-lg pointer-events-none"></div>
      <h2 className="text-2xl text-white font-bold mb-4 text-center">
        Features
      </h2>

      <ul className="space-y-2 mb-4 flex-grow">
        <AnimatePresence>
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-2 flex items-center justify-between space-x-2"
            >
              <div className="flex items-center space-x-2 flex-grow">
                <AlertTriangle className="text-yellow-500" />
                <span className="text-white">{feature}</span>
              </div>
              <X
                className="text-red-500"
                onClick={() => removeFeature(feature)}
              ></X>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className="mt-auto w-full rounded-lg">
        <Input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="New feature"
          className="mb-2 w-full"
        />
        <Button
          onClick={addFeature}
          className="w-full flex items-center justify-center text-xl border active:scale-95 rounded-full bg-gradient-to-br from-gray-800 to-black backdrop-blur-lg shadow-lg border-gray-900 hover:text-white hover:border-gray-700 mt-2 "
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          <span>Add Feature</span>
        </Button>
      </div>
    </div>
  );
};

export default FeatureList;
