import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  getAllPayments,
  updatePaymentStatus,
} from "@/controllers/PaymentController";
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { Timestamp } from "firebase/firestore";

export const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null); // State for approval status
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  ); // State to hold the selected payment ID

  const formattedDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return null; // or return an empty string or a default value
  };

  const handleModalOpen = (slipUrl, paymentId, status) => {
    setSelectedStatus(status);
    setSelectedSlipUrl(slipUrl);
    setSelectedPaymentId(paymentId); // Set the selected payment ID
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedSlipUrl(null); // Reset selected slip URL
    setApprovalStatus(null); // Reset approval status
    setSelectedPaymentId(null); // Reset selected payment ID
    setSelectedStatus(null);
  };

  const handleApprovalClick = async (status) => {
    setApprovalStatus(status);
    if (selectedPaymentId) {
      try {
        await updatePaymentStatus(selectedPaymentId, status);

        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === selectedPaymentId
              ? { ...payment, status }
              : payment
          )
        );
        Swal.fire({
          title: "Success!",
          text: `Payment status updated to ${status}.`,
          icon: "success",
        });
      } catch (error) {
        console.error("Error updating payment status:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update payment status.",
          icon: "error",
        });
      }
    }
    handleModalClose(); // Close the modal after handling approval
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchData();
  }, [payments]);

  console.log(payments);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const fetch = async () => {
            await deleteWasteType(id);
            const updatedWasteTypes = await getWasteTypes();
            setWasteTypes(updatedWasteTypes);
          };
          fetch();
        } catch (error) {
          console.error("Error deleting waste type:", error);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 min-h-screen">
      <Card>
        <CardHeader
          variant="gradient"
          color={sidenavColor !== "dark" ? sidenavColor : "gray"}
          className="mb-8 p-6"
        >
          <Typography
            variant="h6"
            color={sidenavColor !== "white" ? "white" : "grey"}
          >
            Payments
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "PaymentID",
                  "User",
                  "Amount",
                  "Method",
                  "Status",
                  "Slip",
                  "Date",
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400 text-center"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments?.map(
                (
                  {
                    paymentID,
                    userEmail,
                    amount,
                    method,
                    status,
                    slipUrl,
                    date,
                    id,
                  },
                  key
                ) => {
                  const className = `py-3 px-5 ${
                    key === payments.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={paymentID}>
                      <td className={`${className} text-center justify-center`}>
                        <div>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {paymentID}
                          </Typography>
                        </div>
                      </td>
                      <td className={`${className} text-center justify-center`}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {userEmail}
                        </Typography>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {parseFloat(amount).toFixed(2)}
                        </Typography>
                      </td>
                      <td className={`${className} text-center justify-center`}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {method === "bank" ? "Bank Deposit" : "Card Payment"}
                        </Typography>
                      </td>
                      <td
                        className={`${className} flex items-center justify-center text-center`}
                      >
                        <Chip
                          variant="gradient"
                          color={
                            status === "Pending"
                              ? "orange"
                              : status === "Success"
                              ? "green"
                              : status === "Rejected"
                              ? "red"
                              : "gray" // Default color
                          }
                          value={status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>

                      {/* Slip Column */}
                      <td className={`${className} text-center`}>
                        {slipUrl ? (
                          <IoEyeOutline
                            size={24}
                            className="text-blue-500 cursor-pointer mx-auto" // Center the icon
                            onClick={() => handleModalOpen(slipUrl, id, status)} // Pass paymentID here
                          />
                        ) : (
                          <Typography className="text-xs text-gray-500">
                            No Slip
                          </Typography>
                        )}
                      </td>

                      <td className={`${className} text-center justify-center`}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {formattedDate(date)}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white relative p-6 rounded-lg shadow-2xl max-w-lg w-full">
            <AiOutlineClose
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-600 cursor-pointer hover:text-gray-800 transition"
              size={24}
            />
            {selectedSlipUrl && (
              <img
                src={selectedSlipUrl}
                alt="Slip"
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {selectedStatus === "Pending" && (
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => handleApprovalClick("Success")} // Pass "Success" here
                  className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApprovalClick("Rejected")} // Pass "Rejected" here
                  className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
