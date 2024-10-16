import { Button, Switch, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { addBin } from "@/controllers/BinsController"; // Import the controller function

export const AddBin = () => {
  const [formData, setFormData] = useState({
    binID: "",
    type: "",
    user: "",
    perKg: "",
    qrCode: "",
    wasteLevel: 0,
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

  // Handle Select changes for bin color
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBinColor(e.target.value);
    setFormData({
      ...formData,
      type:
        e.target.value === "custom" ? formData.customBinColor : e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addBin(formData);
      console.log("Bin added successfully!");
    } catch (error) {
      console.error("Failed to add bin", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Bin
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Bin ID
            </Typography>
            <input
              type="text"
              id="binID"
              name="binID"
              value={formData.binID}
              onChange={handleChange}
              placeholder="e.g., B001"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              User (Assigned User ID)
            </Typography>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="e.g., UserID123"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Cost Per Kg
            </Typography>
            <input
              type="text"
              id="perKg"
              name="perKg"
              value={formData.perKg}
              onChange={handleChange}
              placeholder="Enter cost per kg"
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

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              QR Code
            </Typography>
            <input
              type="text"
              id="qrCode"
              name="qrCode"
              value={formData.qrCode}
              onChange={handleChange}
              placeholder="Enter QR code string"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Save Bin
          </Button>
        </form>
      </div>
    </div>
  );
};
