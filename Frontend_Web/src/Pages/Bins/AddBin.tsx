import { Button, Typography } from "@material-tailwind/react";
import { useState, useEffect, useRef } from "react";
import { addBin, getLastBinID } from "@/controllers/BinsController"; 
import { getWasteTypes } from "@/controllers/WasteTypeController"; 
import { useNavigate } from "react-router-dom";
import {QRCodeCanvas} from "qrcode.react"; // Import QRCode
import html2canvas from "html2canvas"; // Import html2canvas

export const AddBin = () => {
  const [formData, setFormData] = useState({
    binID: "",
    type: "",
    user: "",
    perKg: "",
    wasteLevel: 0,
    customBinColor: "",
  });
  const [binColor, setBinColor] = useState<string>("");
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const qrCodeRef = useRef<HTMLDivElement>(null); // Reference for QR code

  const navigate = useNavigate();

  // Fetch waste types when the component mounts
  useEffect(() => {
    const fetchWasteTypes = async () => {
      try {
        const types = await getWasteTypes();
        setWasteTypes(types);
        console.log(types);
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };

    fetchWasteTypes();
  }, []);

  // Fetch the last binID and generate a new one
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

  // Fetch new binID on component mount
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
      navigate("Bin");
      console.log("Bin added successfully!");
    } catch (error) {
      console.error("Failed to add bin", error);
    }
  };

  // Function to download the QR code
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
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
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
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select waste type</option>
              {wasteTypes.map((type) => (
                <option key={type.wasteType} value={type.wasteType}>
                  {type.wasteType}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </div>

          {binColor === "custom" && (
            <div className="space-y-2">
              <Typography variant="small" className="font-normal text-blue-gray-600">
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
