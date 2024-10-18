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
import {
  deleteCollectionModel,
  getCollectionModels,
} from "@/controllers/CollectionModelController"; // Adjusted controller
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const CollectionModels = () => {
  const navigate = useNavigate();
  const [collectionModels, setCollectionModels] = useState<any[]>([]);
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCollectionModels(); // Fetching collection models instead of waste types
        setCollectionModels(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching collection models:", error);
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
            await deleteCollectionModel(id); // Deleting the collection model
            const updatedCollectionModels = await getCollectionModels();
            setCollectionModels(updatedCollectionModels);
          };
          fetch();
        } catch (error) {
          console.error("Error deleting collection model:", error);
        }
        Swal.fire({
          title: "Deleted!",
          text: "The collection model has been deleted.",
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
            Collection Models
          </Typography>
          <Button
            variant="contained"
            color={sidenavColor === "white" ? "black" : "white"}
            onClick={() => navigate(`/dashboard/addcollectionmodel`)}
          >
            Add Model
          </Button>
        </CardHeader>
        <CardBody className=" px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Model Name",
                  "Collection Frequency",
                  "Waste Types",
                  "Price (LKR)",
                  "Locations",
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
              {collectionModels?.map(
                (
                  {
                    modelName,
                    collectionFrequency,
                    wasteTypes,
                    flatRatePrice,
                    locations,
                    id,
                  },
                  key
                ) => {
                  const className = `py-3 px-5 ${
                    key === collectionModels.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <div>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {modelName}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {collectionFrequency}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {wasteTypes.join(", ")}
                        </Typography>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {flatRatePrice
                            ? parseFloat(flatRatePrice)?.toFixed(2)
                            : "Not Available"}
                        </Typography>
                      </td>
                      <td className={className + " text-center"}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 text-center">
                          {locations &&
                          locations.length > 0 &&
                          locations.some((location) => location !== null) ? (
                            locations
                              .filter((location) => location !== null) // Filter out null values
                              .map((location) => location?.locationName) // Map to location names
                              .join(", ")
                          ) : (
                            <Chip
                              variant="gradient"
                              color={"red"}
                              value={"No Locations Assigned"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit mx-auto"
                            />
                          )}
                        </Typography>
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
                                navigate(
                                  `/dashboard/updatecollectionmodel/${id}`
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
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
