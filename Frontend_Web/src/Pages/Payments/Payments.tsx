import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { getAllPayments } from "@/controllers/PaymentController";
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

export const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };

    fetchData();
  }, []);

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
        <CardBody className=" px-0 pt-0 pb-2">
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
                  },
                  key
                ) => {
                  const className = `py-3 px-5 ${
                    key === payments.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {paymentID}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {userEmail}
                        </Typography>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {parseFloat(amount).toFixed(2)}
                        </Typography>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {method === "bank" ? "Bank Deposit" : "Card Payment"}
                        </Typography>
                      </td>
                      <td className={`${className} text-center justify-center`}>
                        <Chip
                          variant="gradient"
                          style={{
                            backgroundColor:
                              status === "Pending"
                                ? "#FFA500"
                                : status === "Success"
                                ? "#4CAF50"
                                : status === "Rejected"
                                ? "#FF0000"
                                : "#B0B0B0",
                          }}
                          value={
                            status === "Pending"
                              ? "Pending"
                              : status === "Success"
                              ? "Success"
                              : status === "Rejected"
                              ? "Rejected"
                              : "Unknown"
                          }
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      {slipUrl && (
                        <td className={className + " text-center"}>
                          <IoEyeOutline
                            size={24}
                            className="text-blue-500 cursor-pointer"
                            onClick={handleModalOpen}
                          />
                        </td>
                      )}
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {date}
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500"
            >
              Close
            </button>
            <img src={slipUrl} alt="Slip" className="max-w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};
