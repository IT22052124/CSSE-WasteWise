import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline"; // Importing the TrashIcon
import { getBins, autoUpdateWasteLevels, deleteBin } from "@/controllers/BinsController";
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import { toast } from 'react-toastify'; // Import toast

export const Bins = () => {
  const [bins, setBins] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBins(); // Fetch bin data
        setBins(data);
        autoUpdateWasteLevels(); // Start auto-updating waste levels
      } catch (error) {
        console.error("Error fetching bins:", error);
      }
    };

    fetchData(); // Initial fetch

    // Set up interval for fetching data every 10 seconds
    const intervalId = setInterval(fetchData, 10000000); // 10000 ms = 10 seconds

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only on mount

  const handleDelete = async (id: string) => {
    try {
      await deleteBin(id);
      toast.success("Bin deleted successfully!");

      setBins((prevBins) => prevBins.filter((bin) => bin.binID !== id)); // Update the state after deleting
    } catch (error) {
      console.error("Error deleting bin:", error);
    }
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
            Bins
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Bin ID", "Type", "User", "Address", "Waste Level", "Cost per kg", "Actions"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bins?.map(({ id, binID, type, user, wasteLevel }, key) => {
                const className = `py-3 px-5 ${key === bins.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={binID}>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">{binID}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{type.binType}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{user.username}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{user.address}</Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={wasteLevel > 70 ? "red" : "green"}
                        value={`${wasteLevel.toFixed(2)}%`}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{type.chargingPerKg }</Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* Edit Icon */}
                        
                        {/* Delete Icon */}
                        <IconButton
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(id)}
                        >
                          <TrashIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
