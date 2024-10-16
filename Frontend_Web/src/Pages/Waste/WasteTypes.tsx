import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { getWasteTypes } from "@/controllers/WasteTypeController";
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";

export const WasteTypes = () => {
  const [wasteTypes, setWasteTypes] = useState<any[]>([]);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor } = controller;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWasteTypes();
        setWasteTypes(data);
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };

    fetchData();
  }, []);
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
            Waste Types
          </Typography>
        </CardHeader>
        <CardBody className=" px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Type Name",
                  "Description",
                  "Guidelines",
                  "recyclable",
                  "incentives",
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
              {wasteTypes?.map(
                (
                  {
                    wasteType,
                    recyclable,
                    incentives,
                    guidelines,
                    description,
                    binType,
                  },
                  key
                ) => {
                  const className = `py-3 px-5 ${
                    key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {wasteType}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {description}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {guidelines}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={recyclable ? "green" : "blue-gray"}
                          value={recyclable ? "Yes" : "No"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {incentives}
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
