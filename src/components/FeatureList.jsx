import { AlertTriangle, PlusCircle, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

const FeatureList = ({ features, newFeature, setNewFeature, addFeature, removeFeature }) => {
  return (
    <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto flex flex-col rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Features</h2>
      <ul className="space-y-2 mb-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2 flex-grow">
            <AlertTriangle className="text-yellow-500" />
            <span className="text-lg">{feature}</span>
          </div>
          <button
            onClick={() => removeFeature(feature)} // Call removeFeature on click
            className="text-red-500 hover:text-red-700 ml-2" // Add margin to create space from the feature name
            aria-label={`Remove ${feature}`} // Accessibility improvement
          >
            <X className="h-6 w-6" /> {/* Red X icon */}
          </button>
        </li>
        ))}
      </ul>
      <div className="mt-auto w-full rounded-lg">
        <Input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="New feature"
          className="mb-2 w-full"
        />
        <Button
          onClick={addFeature}
          className="w-full flex items-center justify-center text-xl border-2 active:scale-95 hover:bg-white hover:text-black hover:border-black"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          <span>Add Feature</span>
        </Button>
      </div>
    </div>
  );
};

export default FeatureList;