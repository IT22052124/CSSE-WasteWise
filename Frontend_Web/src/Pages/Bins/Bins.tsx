import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { getBins } from "@/controllers/BinsController"; // Assuming you have a BinController to fetch bin data
  import { useEffect, useState } from "react";
  import { useMaterialTailwindController } from "@/context";
  
  export const Bins = () => {
    const [bins, setBins] = useState<any[]>([]);
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavColor } = controller;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getBins(); // Fetch bin data
          setBins(data);
        } catch (error) {
          console.error("Error fetching bins:", error);
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
              Bins
            </Typography>
          </CardHeader>
          <CardBody className=" px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Bin ID",
                    "Type",
                    "User",
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
                {bins?.map(
                  (
                    { binID, type, user, wasteLevel, perKg, binType },
                    key
                  ) => {
                    const className = `py-3 px-5 ${
                      key === bins.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
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
                            {user}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={wasteLevel > 70 ? "red" : "green"}
                            value={`${wasteLevel}%`}
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
  