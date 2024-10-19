import React, { useState, useEffect, useRef } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { addBin, getLastBinID, updateBinRequestStatusByRequestID } from "@/controllers/BinsController"; // Update the import if necessary
import { getBinTypeByBinType } from "@/controllers/BinTypeController";
import { getUserByEmail } from "@/controllers/UserController";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

export const AddBin = () => {
  const [formData, setFormData] = useState({
    binID: "",
    type: {},
    user: {},
    perKg: "",
    capacity: "",
    wasteLevel: 0,
    userRef: "",
    wasteTypeRef: "",
  });

  const [userEmail, setUserEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch new Bin ID on mount
  useEffect(() => {
    const fetchNewBinID = async () => {
      try {
        const lastBinID = await getLastBinID();
        const newBinID = lastBinID
          ? `B${String(parseInt(lastBinID.replace("B", "")) + 1).padStart(3, "0")}`
          : "B001";

        setFormData((prevState) => ({
          ...prevState,
          binID: newBinID,
        }));
      } catch (error) {
        console.error("Error fetching last binID", error);
      }
    };

    fetchNewBinID();
  }, []);

  // Prefill bin type, user email, capacity, and requestID from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prefilledBinType = params.get("binType");
    const prefilledUserEmail = params.get("userEmail");
    const prefilledCapacity = params.get("capacity");
    const requestID = params.get("ReqID"); // Get requestID from query parameters

    if (prefilledBinType) {
      const fetchWasteType = async () => {
        try {
          const wasteType = await getBinTypeByBinType(prefilledBinType);
          if (wasteType) {
            setFormData((prevState) => ({
              ...prevState,
              type: wasteType,
              wasteTypeRef: wasteType.id,
            }));
          }
        } catch (error) {
          console.error("Error fetching waste type by bin type:", error);
        }
      };

      fetchWasteType();
    }

    if (prefilledUserEmail) {
      setUserEmail(prefilledUserEmail);
    }

    if (prefilledCapacity) {
      setFormData((prevState) => ({
        ...prevState,
        capacity: prefilledCapacity,
      }));
    }

    // Store requestID in the state if needed
    if (requestID) {
      setFormData((prevState) => ({
        ...prevState,
        requestID, // Add this to formData if necessary
      }));
    }
  }, [location.search]);

  // Fetch the user object based on the entered email when userEmail changes
  useEffect(() => {
    const fetchUser = async () => {
      if (userEmail) {
        try {
          const user = await getUserByEmail(userEmail);
          if (user) {
            setFormData((prevState) => ({
              ...prevState,
              user,
              userRef: user.id,
            }));
          } else {
            console.error("User not found");
          }
        } catch (error) {
          console.error("Error fetching user", error);
        }
      }
    };

    fetchUser();
  }, [userEmail]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userRef) {
      console.error("User reference is missing.");
      return;
    }

    if (!formData.wasteTypeRef) {
      console.error("Waste type reference is missing.");
      return;
    }

    setIsSubmitting(true);

    const binData = {
      ...formData,
      userRef: formData.userRef,
      wasteTypeRef: formData.wasteTypeRef,
    };

    try {
      await addBin(binData);

      // Update the status of the bin request using the requestID
      if (formData.requestID) {
        await updateBinRequestStatusByRequestID(formData.requestID);
      }

      navigate("/dashboard/bin");
    } catch (error) {
      console.error("Failed to add bin", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download QR code
  const downloadQRCode = async () => {
    if (qrCodeRef.current) {
      const canvas = await html2canvas(qrCodeRef.current);
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${formData.binID}_qrcode.png`;
      a.click();
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
          {/* Bin ID */}
          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Bin ID
            </Typography>
            <input
              type="text"
              name="binID"
              value={formData.binID}
              disabled
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Waste Type */}
          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Waste Type
            </Typography>
            <input
              type="text"
              name="wasteType"
              value={formData.type?.binType || ""}
              disabled
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* User Email */}
          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              User Email (Assigned User)
            </Typography>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="e.g., user@example.com"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Capacity (Prefilled and disabled) */}
          <div className="space-y-2">
            <Typography variant="small" className="font-normal text-blue-gray-600">
              Capacity
            </Typography>
            <input
              type="text"
              name="capacity"
              value={formData.capacity}
              disabled
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>


          <Button
            type="submit"
            className="w-full mt-4 bg-green-500 hover:bg-green-600"
            disabled={!formData.userRef || !formData.wasteTypeRef || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Bin"}
          </Button>
        </form>

        {/* QR Code */}
        
        <div
  ref={qrCodeRef}
  className="mt-8 p-4 bg-white shadow-md rounded-lg flex flex-col justify-center items-center" // Changed flex direction to column
>
  <Typography variant="h6" className="text-center mb-4">
    Bin ID: {formData.binID}
  </Typography>
  <QRCodeCanvas value={`${formData.binID}`} />
</div>
        
        <Button onClick={downloadQRCode} className="mt-4 w-full">
          Download QR Code
        </Button>
      </div>
    </div>
  );
};

export default AddBin;
