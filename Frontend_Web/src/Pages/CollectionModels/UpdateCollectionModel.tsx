import { Button, Switch, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  updateCollectionModel,
  getCollectionModelById,
} from "@/controllers/CollectionModelController"; // Import controller functions
import { useMaterialTailwindController } from "@/context";
import { useNavigate, useParams } from "react-router-dom";
import { getWasteTypesWithBinInfo } from "@/controllers/WasteTypeController";

export const UpdateCollectionModel = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const { id } = useParams(); // Get the ID from URL parameters
  const [formData, setFormData] = useState({
    modelName: "",
    collectionFrequency: "Weekly",
    chargingMethod: "",
    customFrequency: "",
    wasteTypes: [],
    flatRatePrice: 0,
  });

  useEffect(() => {
    // Fetch the existing collection model to update
    const fetchCollectionModel = async () => {
      try {
        const data = await getCollectionModelById(id);
        setFormData({
          modelName: data.modelName,
          collectionFrequency: data.collectionFrequency,
          chargingMethod: data.chargingMethod,
          wasteTypes: data.wasteTypes || [],
          flatRatePrice: data.flatRatePrice || 0,
        });
        setSelectedWasteTypes(data.wasteTypes || []);
      } catch (error) {
        console.error("Error fetching collection model:", error);
      }
    };

    fetchCollectionModel();
  }, [id]);

  useEffect(() => {
    const fetchWasteTypes = async () => {
      try {
        const data = await getWasteTypesWithBinInfo();
        setWasteTypes(data.map((wasteType) => wasteType.wasteType));
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };
    fetchWasteTypes();
  }, []);

  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [all, setAll] = useState(false);

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

    if (checked) {
      setSelectedWasteTypes((prev) => {
        const updated = [...prev, value];
        setFormData({
          ...formData,
          wasteTypes: updated,
        });
        return updated;
      });
    } else {
      setSelectedWasteTypes((prev) => {
        const updated = prev.filter((type) => type !== value);
        setFormData({
          ...formData,
          wasteTypes: updated,
        });
        return updated;
      });
    }
  };

  useEffect(() => {
    if (selectedWasteTypes.length === wasteTypes.length) {
      setAll(true);
    } else {
      setAll(false);
    }
  }, [selectedWasteTypes, wasteTypes]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChangeAll = () => {
    const updatedAll = !all;
    setAll(updatedAll);

    if (updatedAll) {
      setSelectedWasteTypes(wasteTypes);
    } else {
      setSelectedWasteTypes([]);
    }

    setFormData({
      ...formData,
      wasteTypes: updatedAll ? wasteTypes : [],
    });
  };

  // Handle form submission for update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateCollectionModel(id, formData); // Call update instead of add
      navigate("/dashboard/collectionmodels");
    } catch (error) {
      console.error("Failed to update collection model", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Update Collection Model
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
              <option value="Custom">Yearly</option>
            </select>
          </div>

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

          {formData.chargingMethod === "Flat-rate pricing" && (
            <div className="space-y-2">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
                Price (Flat-rate) (LKR)
              </Typography>
              <input
                type="text"
                id="flatRatePrice"
                name="flatRatePrice"
                value={formData.flatRatePrice}
                onChange={handleChange}
                placeholder="Enter flat rate price"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}

          {/* Waste Types Collected */}
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Waste Types Collected
            </Typography>
            <div className="space-y-1">
              <Switch
                id={`All`}
                label={"All"}
                checked={all}
                onChange={handleCheckboxChangeAll}
                value={"All"}
                labelProps={{
                  className: "text-sm font-normal text-blue-gray-500 m-3",
                }}
              />
              {wasteTypes.map((type, index) => (
                <Switch
                  key={index}
                  id={`WasteType-${index}`}
                  label={type}
                  checked={selectedWasteTypes.includes(type)}
                  onChange={handleCheckboxChange}
                  value={type}
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
            Update Collection Model
          </Button>
        </form>
      </div>
    </div>
  );
};
