import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { getBins, updateBinWasteLevel } from "@/controllers/BinsController";
import { useMaterialTailwindController } from "@/context";

export const Bins = () => {
  const [bins, setBins] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBins();
        // Initialize bins with random waste levels
        const initializedBins = data.map(bin => ({
          ...bin,
          wasteLevel: Math.random() * 100,
          lastUpdate: Date.now(),
        }));
        setBins(initializedBins);
      } catch (error) {
        console.error("Error fetching bins:", error);
      }
    };

    fetchData();
  }, []);

  // Total increments for 24 hours (every 10 seconds)
  const totalIncrements = Math.floor(8640 / 10);
  const incrementAmount = 100 / totalIncrements; // Increase by this much each time

  useEffect(() => {
    const updateWasteLevels = async () => {
      const currentTime = Date.now();
      const updatedBins = await Promise.all(
        bins.map(async (bin) => {
          const { id, lastUpdate, wasteLevel } = bin;
          if (!id) {
            console.error("Missing document ID for bin:", bin);
            return bin;
          }

          // Calculate time passed since last update
          const timeSinceUpdate = (currentTime - lastUpdate) / 1000; // in seconds
          const incrementsSinceUpdate = Math.floor(timeSinceUpdate / 10);

          // Calculate new waste level
          let newWasteLevel = Math.min(wasteLevel + (incrementsSinceUpdate * incrementAmount), 100);

          try {
            await updateBinWasteLevel(id, newWasteLevel);
            return { ...bin, wasteLevel: newWasteLevel, lastUpdate: currentTime };
          } catch (error) {
            console.error("Error updating waste level:", error);
            return bin;
          }
        })
      );

      setBins(updatedBins);
    };

    if (bins.length > 0) {
      const intervalId = setInterval(updateWasteLevels, 10000); // Update every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [bins]);

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
                {[
                  "Bin ID",
                  "Type",
                  "User",
                  "Address",
                  "Waste Level",
                  "Cost per kg",
                  "Bin Color",
                  "",
                ].map((el) => (
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
              {bins.map(
                (
                  { binID, type, user, wasteLevel, perKg, binType },
                  key
                ) => {
                  const className = `py-3 px-5 ${
                    key === bins.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={binID}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {binID}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {type}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user?.username || "N/A"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user?.address || "N/A"}
                        </Typography>
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
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {perKg}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {binType}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
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
    </div>
  );
};