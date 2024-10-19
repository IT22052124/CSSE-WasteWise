import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    MenuItem,
    MenuList,
    Menu,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { getBins,autoUpdateWasteLevels,deleteBin} from "@/controllers/BinsController"; // Assuming you have a BinController to fetch bin data
  import { useEffect, useState } from "react";
  import { useMaterialTailwindController } from "@/context";
  import Swal from "sweetalert2";

  export const Bins = () => {
    const [bins, setBins] = useState<any[]>([]);
    const [controller, dispatch] = useMaterialTailwindController();
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
      const intervalId = setInterval(fetchData, 1000000); // 10000 ms = 10 seconds
  
      // Cleanup function to clear the interval on component unmount
      return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run only on mount
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
              await deleteBin(id);
              
            };
            fetch();
          } catch (error) {
            console.error("Error deleting bin type:", error);
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
                    "Address",
                    "Waste Level",
                    "Cost per kg",
                    "Edit",
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
                            {type.binType}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user.username}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user.address}
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
                       
                            <MenuItem
                              className="flex items-center gap-3"
                              onClick={() => handleDelete(id)}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="mb-1 font-normal"
                              >
                                <strong>Delete</strong>
                              </Typography>
                            </MenuItem>
                          </MenuList>
                        </Menu>
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
  