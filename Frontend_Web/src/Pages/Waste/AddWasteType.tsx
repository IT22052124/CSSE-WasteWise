import { Button, Switch, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { addWasteType } from "@/controllers/WasteTypeController"; // Import the controller function

export const AddWasteType = () => {
  const [formData, setFormData] = useState({
    wasteType: "",
    description: "",
    guidelines: "",
    recyclable: false,
    incentives: "",
    binType: "",
    customBinColor: "",
  });

  const [binColor, setBinColor] = useState<string>("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Switch input
  const handleSwitchChange = () => {
    setFormData({
      ...formData,
      recyclable: !formData.recyclable,
    });
  };

  // Handle Select changes for bin color
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBinColor(e.target.value);
    setFormData({
      ...formData,
      binType:
        e.target.value === "custom" ? formData.customBinColor : e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addWasteType(formData);
      console.log("Waste type added successfully!");
    } catch (error) {
      console.error("Failed to add waste type", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Waste Type
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Waste Type Name
            </Typography>
            <input
              type="text"
              id="wasteType"
              name="wasteType"
              value={formData.wasteType}
              onChange={handleChange}
              placeholder="e.g., Organic Waste"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Description
            </Typography>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the waste type..."
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Disposal Guidelines
            </Typography>
            <textarea
              id="guidelines"
              name="guidelines"
              value={formData.guidelines}
              onChange={handleChange}
              rows={3}
              placeholder="Enter disposal guidelines..."
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recyclable"
              label="Recyclable Status"
              checked={formData.recyclable}
              onChange={handleSwitchChange}
              labelProps={{
                className: "text-sm font-normal text-blue-gray-500",
              }}
            />
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Payback/Incentives
            </Typography>
            <input
              type="text"
              id="incentives"
              name="incentives"
              value={formData.incentives}
              onChange={handleChange}
              placeholder="Enter payback or incentives..."
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Waste Bin Type/Color
            </Typography>
            <select
              id="binColor"
              name="binColor"
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select bin color</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {binColor === "custom" && (
            <div className="space-y-2">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
                Custom Bin Color
              </Typography>
              <input
                type="text"
                id="customBinColor"
                name="customBinColor"
                value={formData.customBinColor}
                onChange={handleChange}
                placeholder="Enter custom color"
                className="mt-1 p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}

          <Button className="mt-6" fullWidth type="submit">
            Save Waste Type
          </Button>
        </form>
      </div>
    </div>
  );
};
