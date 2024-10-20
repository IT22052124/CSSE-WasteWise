import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  deleteWasteType,
  getWasteTypesWithBinInfo,
} from "@/controllers/WasteTypeController";
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loader";

export const WasteTypes = () => {
  const navigate = useNavigate();
  const [wasteTypes, setWasteTypes] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;
  const [loading, setLoading] = useState(false);

  // Fetch waste types
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch waste types with bin info
        const data = await getWasteTypesWithBinInfo();
        setWasteTypes(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching waste types:", error);
      }
    };

    fetchData();
  }, []);

  // Delete a waste type
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
            const updatedWasteTypes = await getWasteTypesWithBinInfo();
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
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography
            variant="h6"
            color={sidenavColor !== "white" ? "white" : "grey"}
          >
            Waste Types
          </Typography>
          <Button
            variant="contained"
            color={sidenavColor === "white" ? "black" : "white"}
            onClick={() => navigate(`/dashboard/addwastetypes`)}
          >
            Add Type
          </Button>
        </CardHeader>
        <CardBody className=" px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            {loading ? (
              <Loader />
            ) : (
              <>
                <thead>
                  <tr>
                    {[
                      "Type Name",
                      "Description",
                      "Guidelines",
                      "Recyclable",
                    ].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                        rowSpan={2}
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400 text-center"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}

                    <th
                      colSpan={2}
                      className="border-b border-blue-gray-50 py-3 px-5 text-center "
                    >
                      <Typography
                        variant="small"
                        className="text-[12px] font-bold uppercase text-blue-gray-600"
                      >
                        Connected Bin
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      rowSpan={2}
                    ></th>
                  </tr>

                  <tr>
                    {["Bin Name", "Bin Color"].map((el) => (
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
                  {wasteTypes?.map(
                    (
                      {
                        wasteType,
                        recyclable,
                        guidelines,
                        description,
                        selectedColor,
                        id,
                        Bin,
                        binType,
                      },
                      key
                    ) => {
                      const className = `py-3 px-5 ${
                        key === wasteTypes.length - 1
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
                          <td
                            className={`${className} text-center  justify-center `}
                          >
                            <Chip
                              variant="gradient"
                              color={recyclable ? "green" : "blue-gray"}
                              value={recyclable ? "Yes" : "No"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit mx-auto"
                            />
                          </td>
                          {Bin ? (
                            <>
                              <td className={className + " text-center"}>
                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                  {binType}
                                </Typography>
                              </td>

                              <td className={className + " text-center"}>
                                <IconButton color={selectedColor}></IconButton>
                              </td>
                            </>
                          ) : (
                            <td
                              className={className + " text-center"}
                              colSpan={2}
                            >
                              <Typography className="text-xs font-semibold text-blue-gray-600">
                                No Bin Connected
                              </Typography>
                            </td>
                          )}
                          <td className={className}>
                            <Menu>
                              <MenuHandler>
                                <IconButton variant="text" color="blue-gray">
                                  <EllipsisVerticalIcon
                                    strokeWidth={2}
                                    className="h-5 w-5 text-inherit"
                                  />
                                </IconButton>
                              </MenuHandler>
                              <MenuList className="w-max border-0 text-center ">
                                <MenuItem
                                  className="flex items-center"
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/updatewastetypes/${id}`
                                    )
                                  }
                                >
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-1 font-normal "
                                  >
                                    <strong>Update</strong>
                                  </Typography>
                                </MenuItem>
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
              </>
            )}
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
