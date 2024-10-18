import { Button, Switch, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  addCollectionModel,
  getCollectionModels,
} from "@/controllers/CollectionModelController"; // Import the controller function
import { useMaterialTailwindController } from "@/context";
import { useNavigate } from "react-router-dom";
import { getBinTypes } from "@/controllers/BinTypeController";
import Toast from "@/components/Toast/Toast";
export const AddCollectionModel = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const [formData, setFormData] = useState({
    modelName: "",
    collectionFrequency: "Weekly",
    chargingMethod: "",
    binTypes: [],
    flatRatePrice: 0,
  });

  const [errors, setErrors] = useState({
    modelName: "",
    collectionFrequency: "",
    chargingMethod: "",
    binTypes: "",
    flatRatePrice: "",
  });

  const checkCollectionModelsName = async (modeltype: string) => {
    if (modeltype) {
      const exists = await getCollectionModels();
      const isExist = exists.some(
        (model) => model.modelName.toLowerCase() === modeltype.toLowerCase()
      );

      setErrors((prevErrors) => ({
        ...prevErrors,
        modelName: isExist ? "This Model type name is already taken." : "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelName: "",
      }));
    }
  };

  useEffect(() => {
    const fetchbinTypes = async () => {
      try {
        const data = await getBinTypes();
        setBinTypes(data);
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };
    fetchbinTypes();
  });

  const [binTypes, setBinTypes] = useState<string[]>([]);
  const [selectedBinTypes, setSelectedBinTypes] = useState<string[]>([]);
  const [all, setAll] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "modelName") {
      checkCollectionModelsName(value);
    }
    validateFields(name, value);
  };

  const validateFields = (name: string, value: string) => {
    if (name === "flatRatePrice" && parseFloat(value) <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Price must be greater than 0.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value
          ? ""
          : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
      }));
    }
  };

  const isFormValid = () => {
    // Check if all required fields are filled
    const areRequiredFieldsFilled =
      formData.modelName &&
      formData.collectionFrequency &&
      formData.chargingMethod &&
      formData.binTypes.length > 0;

    const isFlatRatePriceValid =
      formData.chargingMethod === "Flat-rate pricing"
        ? formData.flatRatePrice > 0
        : true;

    const noErrors = Object.values(errors).every((error) => !error);

    return areRequiredFieldsFilled && isFlatRatePriceValid && noErrors;
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    let updatedBinTypes = selectedBinTypes;

    if (checked) {
      updatedBinTypes = [...updatedBinTypes, value];
    } else {
      updatedBinTypes = updatedBinTypes.filter((type) => type !== value);
    }

    setSelectedBinTypes(updatedBinTypes);
    setFormData({
      ...formData,
      binTypes: updatedBinTypes,
    });

    // Check if no bin types are selected
    if (updatedBinTypes.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        binTypes: "Please select at least one bin type.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        binTypes: "",
      }));
    }
  };

  useEffect(() => {
    if (selectedBinTypes.length === binTypes.length) {
      setAll(true);
    } else {
      setAll(false);
    }
  }, [selectedBinTypes, binTypes]);

  // Handle Select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "collectionFrequency" || name === "chargingMethod") {
      validateFields(name, value);
    }
  };

  const handleCheckboxChangeAll = () => {
    const updatedAll = !all;
    setAll(updatedAll);

    let updatedBinTypes;
    if (updatedAll) {
      updatedBinTypes = binTypes.map((type) => type.binType);
    } else {
      updatedBinTypes = [];
    }

    setSelectedBinTypes(updatedBinTypes);
    setFormData({
      ...formData,
      binTypes: updatedBinTypes,
    });

    // Check if no bin types are selected
    if (updatedBinTypes.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        binTypes: "Please select at least one bin type.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        binTypes: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    try {
      await addCollectionModel(formData);
      navigate("/dashboard/collectionmodels");
      Toast("Collection model added successfully", "success");
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
            {errors.modelName && (
              <Typography
                variant="small"
                color={
                  sidenavColor !== "dark"
                    ? sidenavColor !== "white"
                      ? sidenavColor
                      : "gray"
                    : "gray"
                }
              >
                {errors.modelName}
              </Typography>
            )}
          </div>

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
            {errors.collectionFrequency && (
              <Typography
                variant="small"
                color={
                  sidenavColor !== "dark"
                    ? sidenavColor !== "white"
                      ? sidenavColor
                      : "gray"
                    : "gray"
                }
              >
                {errors.collectionFrequency}
              </Typography>
            )}
          </div>

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
            {errors.chargingMethod && (
              <Typography
                variant="small"
                color={
                  sidenavColor !== "dark"
                    ? sidenavColor !== "white"
                      ? sidenavColor
                      : "gray"
                    : "gray"
                }
              >
                {errors.chargingMethod}
              </Typography>
            )}
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
                placeholder="Enter custom frequency"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.flatRatePrice && (
                <Typography
                  variant="small"
                  color={
                    sidenavColor !== "dark"
                      ? sidenavColor !== "white"
                        ? sidenavColor
                        : "gray"
                      : "gray"
                  }
                >
                  {errors.flatRatePrice}
                </Typography>
              )}
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
              {binTypes.map((type, index) => (
                <Switch
                  key={index}
                  id={`WasteType-${index}`}
                  label={type.binType}
                  checked={selectedBinTypes.includes(type.binType)}
                  onChange={handleCheckboxChange}
                  value={type.binType} // This ensures the value is passed correctly to the handler
                  labelProps={{
                    className: "text-sm font-normal text-blue-gray-500 m-3",
                  }}
                />
              ))}
              {errors.binTypes && (
                <Typography
                  variant="small"
                  color={
                    sidenavColor !== "dark"
                      ? sidenavColor !== "white"
                        ? sidenavColor
                        : "gray"
                      : "gray"
                  }
                >
                  {errors.binTypes}
                </Typography>
              )}
            </div>
          </div>

          <Button
            className="mt-6"
            color={
              sidenavColor !== "dark"
                ? sidenavColor !== "white"
                  ? sidenavColor
                  : "gray"
                : "gray"
            }
            fullWidth
            type="submit"
            disabled={!isFormValid()}
          >
            Save Collection Model
          </Button>
        </form>
      </div>
    </div>
  );
};
