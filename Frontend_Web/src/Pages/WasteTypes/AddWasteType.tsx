import { Button, Switch, Typography } from "@material-tailwind/react";
import { useState } from "react";
import {
  addWasteType,
  getWasteTypesWithBinInfo,
} from "@/controllers/WasteTypeController"; // Import the controller function
import { useMaterialTailwindController } from "@/context";
import { useNavigate } from "react-router-dom";
import Toast from "@/components/Toast/Toast";
import { PulseLoader } from "react-spinners";

export const AddWasteType = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const [loading, setLoading] = useState(false);
// Form data
  const [formData, setFormData] = useState({
    wasteType: "",
    description: "",
    guidelines: "",
    recyclable: false,
  });
// Form errors
  const [errors, setErrors] = useState({
    wasteType: "",
    description: "",
    guidelines: "",
  });
// Check if the waste type name already exists
  const checkWasteTypeName = async (wasteType: string) => {
    if (wasteType) {
      const exists = await getWasteTypesWithBinInfo();
      const isExist = exists.some(
        (waste) => waste.wasteType.toLowerCase() === wasteType.toLowerCase()
      );

      setErrors((prevErrors) => ({
        ...prevErrors,
        wasteType: isExist ? "This waste type name is already taken." : "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        wasteType: "",
      }));
    }
  };
// Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "wasteType") {
      checkWasteTypeName(value);
    }

    validateFields(name, value);
  };

  //
  const handleSwitchChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      recyclable: !prevData.recyclable,
    }));
  };
// Validate form fields
  const validateFields = (name: string, value: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value
        ? ""
        : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
    }));
  };

  // Check if the form is valid
  const isFormValid = () => {
    return (
      formData.wasteType &&
      formData.description &&
      formData.guidelines &&
      Object.values(errors).every((error) => !error)
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isFormValid()) {
      return;
    }

    try {
      // Add waste type
      await addWasteType(formData);
      navigate("/dashboard/wastetypes");
      Toast("Waste type added successfully", "success");
      setloading(false);
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
            {errors.wasteType && (
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
                {errors.wasteType}
              </Typography>
            )}
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
            {errors.description && (
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
                {errors.description}
              </Typography>
            )}
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
            {errors.guidelines && (
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
                {errors.guidelines}
              </Typography>
            )}
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
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <>
                <PulseLoader size={10} color="#ffffff" />
              </>
            ) : (
              "Save Waste Type"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
