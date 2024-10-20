import { Button, Switch, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useMaterialTailwindController } from "@/context";
import { useNavigate } from "react-router-dom";
import {
  getAllWasteTypes,
  createBinType,
} from "@/controllers/BinTypeController";
import { PulseLoader } from "react-spinners";

export const AddBinType = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    binType: "",
    recyclable: false,
    incentivesPerKg: 0,
    chargingPerKg: 0,
    binSizes: {
      small: 0,
      medium: 0,
      large: 0,
    },
    customBinColor: "",
    selectedColor: "",
  });

  const [wasteTypes, setWasteTypes] = useState([]);
  const [waste, setWaste] = useState([]);
  const [errors, setErrors] = useState({});

  //get all waste types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllWasteTypes();
        setWaste(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = () => {
    setFormData({
      ...formData,
      recyclable: !formData.recyclable,
    });
  };

  // validate the form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.binType.trim()) {
      newErrors.binType = "Bin Type name cannot be empty.";
    }
    if (wasteTypes.length === 0) {
      newErrors.wasteTypes = "At least one waste type should be selected.";
    }
    if (formData.binSizes.small <= 0) {
      newErrors.small = "Price for small bin cannot be zero or less.";
    }
    if (formData.binSizes.medium <= 0) {
      newErrors.medium = "Price for medium bin cannot be zero or less.";
    }
    if (formData.binSizes.large <= 0) {
      newErrors.large = "Price for large bin cannot be zero or less.";
    }
    if (formData.chargingPerKg <= 0) {
      newErrors.chargingPerKg = "Charging per KG cannot be zero or less.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Form is valid if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    const dataToSubmit = {
      ...formData,
      wasteTypes: wasteTypes,
    };
    try {
      await createBinType(dataToSubmit);
      setIsLoading(false);
      navigate("/dashboard/bintypes");
    } catch (error) {
      console.error("Failed to add waste type", error);
    }
  };

  // Add waste type to the list
  const addWasteTypeToList = (type) => {
    if (!wasteTypes.includes(type)) {
      setWasteTypes([...wasteTypes, type]);
    }
  };

  // Remove waste type from the list
  const removeWasteTypeFromList = (type) => {
    setWasteTypes(wasteTypes.filter((t) => t !== type));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Waste Bin Type
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Bin Type Name
            </Typography>
            <input
              type="text"
              id="binType"
              name="binType"
              value={formData.binType}
              onChange={handleChange}
              placeholder="e.g., Organic Waste"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.binType && (
              <p className="text-red-500 text-sm">{errors.binType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Add Waste Types
            </Typography>
            <select
              onChange={(e) => addWasteTypeToList(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value=""
            >
              <option value="" disabled>
                Select waste type
              </option>
              {waste.map((wasteItem) => (
                <option key={wasteItem.wasteType} value={wasteItem.wasteType}>
                  {wasteItem.wasteType}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap mt-2">
              {wasteTypes.map((type, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 rounded-full px-2 py-1"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => removeWasteTypeFromList(type)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    &times; {/* Close button for removing waste type */}
                  </button>
                </span>
              ))}
            </div>
            {errors.wasteTypes && (
              <p className="text-red-500 text-sm">{errors.wasteTypes}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
                Price for Small Bin (LKR)
              </Typography>
              <input
                type="number"
                id="smallPrice"
                name="small"
                value={formData.binSizes.small}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    binSizes: { ...formData.binSizes, small: e.target.value },
                  })
                }
                placeholder="Enter price for small bin"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.small && (
                <p className="text-red-500 text-sm">{errors.small}</p>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
                Price for Medium Bin (LKR)
              </Typography>
              <input
                type="number"
                id="mediumPrice"
                name="medium"
                value={formData.binSizes.medium}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    binSizes: { ...formData.binSizes, medium: e.target.value },
                  });
                }}
                placeholder="Enter price for medium bin"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.medium && (
                <p className="text-red-500 text-sm">{errors.medium}</p>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
                Price for Large Bin (LKR)
              </Typography>
              <input
                type="number"
                id="largePrice"
                name="large"
                value={formData.binSizes.large}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    binSizes: { ...formData.binSizes, large: e.target.value },
                  })
                }
                placeholder="Enter price for large bin"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.large && (
                <p className="text-red-500 text-sm">{errors.large}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Charging Per KG (LKR)
            </Typography>
            <input
              type="number"
              id="chargingPerKg"
              name="chargingPerKg"
              value={formData.chargingPerKg}
              onChange={handleChange}
              placeholder="Enter charging per kg"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.chargingPerKg && (
              <p className="text-red-500 text-sm">{errors.chargingPerKg}</p>
            )}
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Payback/Incentives Per KG (LKR)
            </Typography>
            <input
              type="number"
              id="incentivesPerKg"
              name="incentivesPerKg"
              value={formData.incentivesPerKg}
              onChange={handleChange}
              placeholder="Enter payback or incentives per kg"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Select Bin Color
            </Typography>
            <select
              id="binColor"
              name="selectedColor"
              value={formData.selectedColor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select bin color</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="custom">Custom</option>
            </select>
            {formData.selectedColor === "custom" && (
              <input
                type="text"
                id="customColor"
                name="customBinColor"
                value={formData.customBinColor}
                onChange={handleChange}
                placeholder="Enter custom color (e.g., #FF5733)"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            )}
          </div>

          <div className="flex items-center">
            <Switch
              id="recyclable"
              label="Is this bin type recyclable?"
              checked={formData.recyclable}
              onChange={handleSwitchChange}
            />
          </div>

          <Button
            type="submit"
            variant="filled"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <PulseLoader size={10} color="#ffffff" /> // White loader
            ) : (
              "Add Waste Bin Type"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
