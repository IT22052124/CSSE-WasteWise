import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { addCollector ,getLastCollectorID} from "@/controllers/collectorController"; // Import the function to add a collector
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // Import toast

export const AddCollector = () => {
  const [formData, setFormData] = useState({
    collectorID: "",
    name: "",
    address: "",
    phone:"",
    drivingLicense: "",
    email: "",
    password: "",
  });
  const [lastCollectorID, setLastCollectorID] = useState<string | null>(null);
  const navigate = useNavigate();

  // Function to fetch the last collector ID
  const fetchLastCollectorID = async () => {
    try {
      const lastID = await getLastCollectorID(); // Assuming you have this function
      setLastCollectorID(lastID);
      const newCollectorID = lastID 
        ? `C${String(parseInt(lastID.replace('C', '')) + 1).padStart(3, '0')}`
        : 'C001';

      setFormData((prevState) => ({
        ...prevState,
        collectorID: newCollectorID,
      }));
    } catch (error) {
      console.error("Error fetching last collectorID", error);
    }
  };

  useEffect(() => {
    fetchLastCollectorID();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      //const hashedPassword = await bcrypt.hash(formData.password, 10);
      await addCollector({ ...formData });
      toast.success("New Bin Created successfully!");
      navigate("/dashboard/collectors"); // Navigate to the collectors list page
    } catch (error) {
      console.error("Failed to add collector", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Collector
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Collector ID
            </Typography>
            <input
              type="text"
              id="collectorID"
              name="collectorID"
              value={formData.collectorID}
              disabled
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Name
            </Typography>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter collector's name"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Address
            </Typography>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              phone Number
            </Typography>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Driving License
            </Typography>
            <input
              type="text"
              id="drivingLicense"
              name="drivingLicense"
              value={formData.drivingLicense}
              onChange={handleChange}
              placeholder="Enter driving license number"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Email
            </Typography>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Password
            </Typography>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Save Collector
          </Button>
        </form>
      </div>
    </div>
  );
};
