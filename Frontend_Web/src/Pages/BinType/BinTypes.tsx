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
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { deleteBinType, getBinTypes } from "@/controllers/BinTypeController"; // Update the import path according to your structure
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const BinTypes = () => {
  const navigate = useNavigate();
  const [binTypes, setBinTypes] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBinTypes();
        setBinTypes(data);
      } catch (error) {
        console.error("Error fetching bin types:", error);
      }
    };

    fetchData();
  }, []);

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
            await deleteBinType(id);
            const updatedBinTypes = await getBinTypes();
            setBinTypes(updatedBinTypes);
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
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography
            variant="h6"
            color={sidenavColor !== "white" ? "white" : "grey"}
          >
            Bin Types
          </Typography>
          <Button
            variant="contained"
            color={sidenavColor === "white" ? "black" : "white"}
            onClick={() => navigate(`/dashboard/addbintypes`)}
          >
            Add New Type
          </Button>
        </CardHeader>
        <CardBody className=" px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Type Name",
                  "Waste Types",
                  "Charge (LKR)",
                  "Recyclable",
                  "Payback / incentives (LKR) ",
                  "Bin Prices (LKR)",
                  "Bin Color",
                  "",
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
              {binTypes?.map(
                (
                  {
                    binSizes,
                    binType,
                    chargingPerKg,
                    selectedColor,
                    incentivesPerKg,
                    recyclable,
                    wasteTypes,
                    customBinColor,
                    id,
                  },
                  key
                ) => {
                  const className = `py-3 px-5 ${
                    key === binTypes.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center items-center gap-4">
                          <div>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {binType}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {wasteTypes.map((type, index) => (
                            <div key={index}>{type}</div>
                          ))}
                        </Typography>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {parseFloat(chargingPerKg).toFixed(2)}
                        </Typography>
                      </td>
                      <td className={`${className} text-center align-middle`}>
                        <Chip
                          variant="gradient"
                          color={recyclable ? "green" : "blue-gray"}
                          value={recyclable ? "Yes" : "No"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {incentivesPerKg === 0
                            ? incentivesPerKg
                            : parseFloat(incentivesPerKg).toFixed(2)}
                        </Typography>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {["small", "medium", "large"].map((size) => (
                            <div key={size}>
                              {size === "small"
                                ? "S"
                                : size === "medium"
                                ? "M"
                                : "L"}
                              : {binSizes[size]}
                            </div>
                          ))}
                        </Typography>
                      </td>

                      <td className={className + " text-center"}>
                        <IconButton
                          color={
                            selectedColor === "custom"
                              ? customBinColor
                              : selectedColor.toLowerCase()
                          }
                        ></IconButton>
                      </td>
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
                                navigate(`/dashboard/updatebintypes/${id}`)
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
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
