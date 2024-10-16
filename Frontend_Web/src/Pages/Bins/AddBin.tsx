import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { addBin, getLastBinID } from "@/controllers/BinsController";
import { getWasteTypes } from "@/controllers/WasteTypeController";
import { getUserByEmail } from "@/controllers/UserController"; // Fetch user details by email
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

export const AddBin = () => {
  const [formData, setFormData] = useState({
    binID: "",
    type: "",
    user: {}, // Store user as an object
    perKg: "",
    wasteLevel: 0,
    customBinColor: "",
  });
  const [userEmail, setUserEmail] = useState<string>(""); // Separate email input for lookup
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWasteTypes = async () => {
      try {
        const types = await getWasteTypes();
        setWasteTypes(types);
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };

    fetchWasteTypes();
  }, []);

  const fetchNewBinID = async () => {
    try {
      const lastBinID = await getLastBinID();
      const newBinID = lastBinID 
        ? `B${String(parseInt(lastBinID.replace('B', '')) + 1).padStart(3, '0')}`
        : 'B001';

      setFormData((prevState) => ({
        ...prevState,
        binID: newBinID,
      }));
    } catch (error) {
      console.error("Error fetching last binID", error);
    }
  };

  useEffect(() => {
    fetchNewBinID();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      type: e.target.value,
    });
  };

  // Fetch the user object based on the entered email
  const handleUserLookup = async () => {
    try {
      const user = await getUserByEmail(userEmail); // Fetch the user by their email
      setFormData({
        ...formData,
        user, // Store the entire user object
      });
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addBin(formData);
      navigate("/dashboard/bin");
    } catch (error) {
      console.error("Failed to add bin", error);
    }
  };

  const downloadQRCode = async () => {
    if (qrCodeRef.current) {
      const canvas = await html2canvas(qrCodeRef.current);
      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${formData.binID}_QRCode.png`;
      link.click();
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
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Bin ID
            </Typography>
            <input
              type="text"
              id="binID"
              name="binID"
              value={formData.binID}
              disabled
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              User Email (Assigned User)
            </Typography>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="e.g., user@example.com"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
            <Button type="button" onClick={handleUserLookup}>
              Lookup User
            </Button>
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Cost Per Kg
            </Typography>
            <input
              type="text"
              id="perKg"
              name="perKg"
              value={formData.perKg}
              onChange={handleChange}
              placeholder="Enter cost per kg"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Waste Bin Type
            </Typography>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select waste type</option>
              {wasteTypes.map((type) => (
                <option key={type.wasteType} value={type.wasteType}>
                  {type.wasteType}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              QR Code
            </Typography>
            <div ref={qrCodeRef} className="flex flex-col items-center">
              <QRCodeCanvas value={formData.binID} size={128} />
              <Button onClick={downloadQRCode} className="mt-2" type="button">
                Download QR Code
              </Button>
            </div>
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Save Bin
          </Button>
        </form>
      </div>
    </div>
  );
};
