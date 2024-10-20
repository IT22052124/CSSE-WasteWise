import { Button, Switch, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useMaterialTailwindController } from "@/context";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBinTypeById,
  updateBinType,
  getAllWasteTypes,
} from "@/controllers/BinTypeController";
import { PulseLoader } from "react-spinners";

export const UpdateBinType = () => {
  const { id } = useParams(); // Get binTypeId from URL
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

  //get the bin details to update
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBinTypeById(id); // Fetch bin type by id
        // Set the formData with the entire response data

        setFormData({
          binType: data.binType || "", // Ensure fallback for undefined data
          recyclable: data.recyclable || false,
          incentivesPerKg: data.incentivesPerKg || 0,
          chargingPerKg: data.chargingPerKg || 0,
          binSizes: {
            small: data.binSizes?.small || 0,
            medium: data.binSizes?.medium || 0,
            large: data.binSizes?.large || 0,
          },
          customBinColor: data.customBinColor || "",
          selectedColor: data.selectedColor || "",
        });

        setWasteTypes(data.wasteTypes);

        const wasteData = await getAllWasteTypes(); // Fetch waste types
        setWaste(wasteData);
      } catch (error) {
        console.error("Error fetching bin type or waste types:", error);
      }
    };
    fetchData();
  }, [id]);

  console.log(formData);
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const dataToSubmit = {
      ...formData,
      wasteTypes: wasteTypes, // Add wasteTypes to the formData
    };
    try {
      await updateBinType(id, dataToSubmit); // Update bin type by id
      setIsLoading(false);
      navigate("/dashboard/bintypes"); // Redirect after update
    } catch (error) {
      console.error("Failed to update bin type", error);
    }
  };

  const addWasteTypeToList = (type) => {
    if (!wasteTypes.includes(type)) {
      setWasteTypes([...wasteTypes, type]);
    }
  };

  const removeWasteTypeFromList = (type) => {
    setWasteTypes(wasteTypes.filter((t) => t !== type));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Update Waste Bin Type
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Add form fields similar to the AddBinType page, but pre-filled with formData */}
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    binSizes: { ...formData.binSizes, medium: e.target.value },
                  })
                }
                placeholder="Enter price for medium bin"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
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
              "Update Waste Bin Type"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
