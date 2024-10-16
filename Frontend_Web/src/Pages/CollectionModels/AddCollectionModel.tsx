import { Button, Switch, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { addCollectionModel } from "@/controllers/CollectionModelController"; // Import the controller function
import { useMaterialTailwindController } from "@/context";
import { useNavigate } from "react-router-dom";
import { getWasteTypes } from "@/controllers/WasteTypeController";

export const AddCollectionModel = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const [formData, setFormData] = useState({
    modelName: "",
    collectionFrequency: "",
    chargingMethod: "",
    customFrequency: "",
    wasteTypes: [],
  });

  useEffect(() => {
    const fetchWasteTypes = async () => {
      try {
        const data = await getWasteTypes();
        setWasteTypes(data.map((wasteType) => wasteType.wasteType));
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };
    fetchWasteTypes();
  });

  const [customFrequency, setCustomFrequency] = useState<string>("");
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log(value, checked);
    if (checked) {
      setSelectedWasteTypes([...selectedWasteTypes, value]);
    } else {
      setSelectedWasteTypes(
        selectedWasteTypes.filter((type) => type !== value)
      );
    }
    setFormData({
      ...formData,
      wasteTypes: selectedWasteTypes,
    });
  };

  // Handle Select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addCollectionModel(formData);
      navigate("/dashboard/collectionmodels");
    } catch (error) {
      console.error("Failed to add collection model", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Collection Model
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Model Name */}
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Model Name
            </Typography>
            <input
              type="text"
              id="modelName"
              name="modelName"
              value={formData.modelName}
              onChange={handleChange}
              placeholder="e.g., Pay-As-You-Throw"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          {/* Collection Frequency */}
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Collection Frequency
            </Typography>
            <select
              id="collectionFrequency"
              name="collectionFrequency"
              value={formData.collectionFrequency}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {formData.collectionFrequency === "Custom" && (
            <div className="space-y-2">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
                Custom Frequency
              </Typography>
              <input
                type="text"
                id="customFrequency"
                name="customFrequency"
                value={customFrequency}
                onChange={handleChange}
                placeholder="Enter custom frequency"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}

          {/* Charging Method */}
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Charging Method
            </Typography>
            <select
              id="chargingMethod"
              name="chargingMethod"
              value={formData.chargingMethod}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select charging method</option>
              <option value="Weight-based pricing">Weight-based pricing</option>
              <option value="Flat-rate pricing">Flat-rate pricing</option>
              <option value="Per collection request">
                Per collection request
              </option>
            </select>
          </div>

          {/* Waste Types Collected */}
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Waste Types Collected
            </Typography>
            <div className="space-y-1">
              {wasteTypes.map((type, index) => (
                <Switch
                  key={index}
                  id={`WasteType-${index}`}
                  label={type}
                  checked={selectedWasteTypes.includes(type)}
                  onChange={handleCheckboxChange}
                  value={type} // This ensures the value is passed correctly to the handler
                  labelProps={{
                    className: "text-sm font-normal text-blue-gray-500 m-3",
                  }}
                />
              ))}
            </div>
          </div>

          <Button
            className="mt-6"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            fullWidth
            type="submit"
          >
            Save Collection Model
          </Button>
        </form>
      </div>
    </div>
  );
};
