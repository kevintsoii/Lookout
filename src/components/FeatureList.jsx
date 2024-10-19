import { AlertTriangle, PlusCircle } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

const FeatureList = ({ features, newFeature, setNewFeature, addFeature }) => {
  return (
    <div className="w-1/4 p-4 bg-white shadow-md overflow-y-auto flex flex-col">
      <h2 className="text-3xl font-bold mb-4 text-center">Features</h2>
      <ul className="space-y-2 mb-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-500" />
            <span className="text-lg">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto w-full">
        <Input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="New feature"
          className="mb-2 w-full"
        />
        <Button onClick={addFeature} className="w-full flex items-center justify-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
};

export default FeatureList;
