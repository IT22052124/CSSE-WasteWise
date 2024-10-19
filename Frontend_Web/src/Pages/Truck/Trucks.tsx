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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  deleteTruck,
  getAllTrucks,
  updateTruckEmployees,
} from "@/controllers/TruckController"; // Adjusted TruckController
import { getCollectors } from "@/controllers/CollectorController";
import { useEffect, useState } from "react";
import { useMaterialTailwindController } from "@/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loader";

export const Trucks = () => {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllTrucks();
        setTrucks(data);
        console.log(data);
        const collectorsData = await getCollectors(); // Fetch employees
        setCollectors(collectorsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trucks:", error);
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
            await deleteTruck(id); // Deleting the truck
            const updatedTrucks = await getAllTrucks();
            setTrucks(updatedTrucks);
          };
          fetch();
        } catch (error) {
          console.error("Error deleting truck:", error);
        }
        Swal.fire({
          title: "Deleted!",
          text: "The truck has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const openModal = (truckId) => {
    setSelectedTruckId(truckId);
    const selectedTruck = trucks.find((truck) => truck.id === truckId);
    setSelectedEmployeeIds(
      selectedTruck.employees.map((employee) => employee.id)
    );
    console.log("selected employees", selectedEmployeeIds);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployeeIds([]);
  };

  const handleAssignEmployee = async () => {
    if (!selectedTruckId || !selectedEmployeeIds) return;
    console.log("selected length ", selectedEmployeeIds.length);
    if (selectedEmployeeIds.length > 2) {
      closeModal();
      Swal.fire(
        "Error",
        "You can only assign 2 or 1 employees.",
        "error"
      ).then(() => openModal(selectedTruckId));
      return;
    }

    try {
      await updateTruckEmployees(selectedTruckId, selectedEmployeeIds);
      const updatedTrucks = await getAllTrucks();
      setTrucks(updatedTrucks);
      closeModal();
      Swal.fire("Success!", "Employee assigned successfully.", "success");
    } catch (error) {
      console.error("Error assigning employee:", error);
      Swal.fire("Error", "Failed to assign employee.", "error");
    }
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployeeIds((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
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
            Trucks
          </Typography>
          <Button
            variant="contained"
            color={sidenavColor === "white" ? "black" : "white"}
            onClick={() => navigate(`/dashboard/addtruck`)}
          >
            Add Truck
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
                      "Truck ID",
                      "Number plate",
                      "Capacity (Kg)",
                      "Locations",
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
                      colSpan={3}
                      className="border-b border-blue-gray-50 py-3 px-5 text-center "
                    >
                      <Typography
                        variant="small"
                        className="text-[12px] font-bold uppercase text-blue-gray-600"
                      >
                        Driver Details
                      </Typography>
                    </th>

                    <th
                      colSpan={2}
                      className="border-b border-blue-gray-50 py-3 px-5 text-center "
                    >
                      <Typography
                        variant="small"
                        className="text-[12px] font-bold uppercase text-blue-gray-600"
                      >
                        Assign Employees
                      </Typography>
                    </th>
                  </tr>
                  <tr>
                    {["Name", "License No", "Telephone"].map((el) => (
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
                    {["ID", "Name", ""].map((el) => (
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
                  {trucks?.map(
                    (
                      {
                        truckId,
                        numberPlate,
                        capacity,
                        locations,
                        id,
                        Driver,
                        employees,
                      },
                      key
                    ) => {
                      const className = `py-3 px-5 ${
                        key === trucks.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;
                      console.log(employees);
                      return (
                        <tr key={id}>
                          <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {truckId.toUpperCase()}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {numberPlate.toUpperCase()}
                            </Typography>
                          </td>
                          <td className={className + " text-center"}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {capacity}
                            </Typography>
                          </td>
                          <td className={className + " text-center"}>
                            <Typography className="text-xs font-semibold text-blue-gray-600 text-center">
                              {locations &&
                              locations.length > 0 &&
                              locations.some(
                                (location) => location !== null
                              ) ? (
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
                          <td className={className + " text-center"}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {Driver?.Drivername}
                            </Typography>
                          </td>
                          <td className={className + " text-center"}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {Driver?.DriverLicense}
                            </Typography>
                          </td>
                          <td className={className + " text-center"}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {Driver?.DriverPhone}
                            </Typography>
                          </td>
                          {employees.filter((employee) => employee !== null)
                            .length > 0 ? (
                            <>
                              <td className={className + " text-center"}>
                                {employees
                                  .filter((employee) => employee !== null)
                                  .map((employee, index) => (
                                    <Typography
                                      key={index}
                                      className="text-xs font-semibold text-blue-gray-600"
                                    >
                                      {employee.collectorID}
                                      {index < employees.length - 1 && (
                                        <br />
                                      )}{" "}
                                      {/* Add break for all except the last */}
                                    </Typography>
                                  ))}
                              </td>
                              <td className={className + " text-center"}>
                                {employees
                                  .filter((employee) => employee !== null)
                                  .map((employee, index) => (
                                    <Typography
                                      key={index}
                                      className="text-xs font-semibold text-blue-gray-600"
                                    >
                                      {employee.name}
                                      {index < employees.length - 1 && (
                                        <br />
                                      )}{" "}
                                    </Typography>
                                  ))}
                              </td>
                            </>
                          ) : (
                            <td
                              colSpan={2}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit mx-auto text-center"
                              onClick={() => openModal(id)}
                            >
                              <Button className="mx-auto">Assign</Button>
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
                                  onClick={() => openModal(id)}
                                >
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-1 font-normal "
                                  >
                                    <strong>Assaign</strong>
                                  </Typography>
                                </MenuItem>
                                <MenuItem
                                  className="flex items-center"
                                  onClick={() =>
                                    navigate(`/dashboard/updatetruck/${id}`)
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
      <Dialog open={isModalOpen} handler={closeModal}>
        <DialogHeader>Assign Employee</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            {collectors?.map((employee) => (
              <Button
                key={employee.id}
                color={
                  selectedEmployeeIds.includes(employee.id) ? "green" : "blue"
                }
                onClick={() => toggleEmployeeSelection(employee.id)}
              >
                {employee.name}
              </Button>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleAssignEmployee}
          >
            Assign
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
