import { Button, Switch, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getWasteTypeById,
  updateWasteType,
} from "@/controllers/WasteTypeController"; // Import controller functions
import { useMaterialTailwindController } from "@/context";

export const UpdateWasteType = () => {
  const { id } = useParams(); // Get waste type ID from the route
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;

  const [formData, setFormData] = useState({
    wasteType: "",
    description: "",
    guidelines: "",
    recyclable: false,
    incentives: 0,
    binType: "",
    customBinColor: "",
    price: 0,
  });

  const [binColor, setBinColor] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Fetch the waste type data when the component loads
  useEffect(() => {
    const fetchWasteType = async () => {
      try {
        const wasteTypeData = await getWasteTypeById(id);
        setFormData(wasteTypeData);
        setBinColor(
          wasteTypeData.customBinColor !== "" ? "custom" : wasteTypeData.binType
        );
        setOpen(wasteTypeData.incentives > 0);
      } catch (error) {
        console.error("Failed to fetch waste type:", error);
      }
    };

    fetchWasteType();
  }, [id]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChangePayback = () => {
    setOpen(!open);
    if (!open) {
      setFormData({
        ...formData,
        incentives: 0,
      });
    }
  };

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
      await updateWasteType(id, formData);
      navigate("/dashboard/wastetypes");
    } catch (error) {
      console.error("Failed to update waste type", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Update Waste Type
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

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Price (LKR per 1 kg)
            </Typography>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter waste collection price..."
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
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

          <div className="flex items-center space-x-2">
            <Switch
              id="Payback/Incentives"
              label="Payback/Incentives"
              checked={open}
              onChange={handleSwitchChangePayback}
              labelProps={{
                className: "text-sm font-normal text-blue-gray-500",
              }}
            />
          </div>
          {open && (
            <div className="space-y-2">
              <input
                type="number"
                id="incentives"
                name="incentives"
                value={formData.incentives}
                onChange={handleChange}
                placeholder="Enter payback or incentives..."
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}

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
              value={binColor}
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

          <Button
            className="mt-6"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            fullWidth
            type="submit"
          >
            Update Waste Type
          </Button>
        </form>
      </div>
    </div>
  );
};
