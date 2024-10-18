import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { deleteLocation, getLocations } from "@/controllers/LocationController"; // Import your controller functions
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const Locations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLocations();
        console.log(data);
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
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
            await deleteLocation(id);
            const updatedLocations = await getLocations();
            setLocations(updatedLocations);
          };
          fetch();
        } catch (error) {
          console.error("Error deleting location:", error);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your location has been deleted.",
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
            Locations
          </Typography>
          <Button
            variant="contained"
            color={sidenavColor === "white" ? "black" : "white"}
            onClick={() => navigate(`/dashboard/addlocation`)}
          >
            Add Location
          </Button>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Location Name", "Collection Model", "Actions"].map((el) => (
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
              {locations?.map(({ id, locationName, collectionModel }, key) => {
                const className = `py-3 px-5 ${
                  key === locations.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={id}>
                    <td className={className + " text-center"}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {locationName}
                      </Typography>
                    </td>

                    <td className={className + " text-center"}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {collectionModel.modelName}
                      </Typography>
                    </td>

                    <td className={className + " text-center"}>
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
                              navigate(`/dashboard/updatelocation/${id}`)
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
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
