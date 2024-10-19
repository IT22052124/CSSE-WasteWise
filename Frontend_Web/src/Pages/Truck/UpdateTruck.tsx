import {
  Button,
  Typography,
  Select,
  Option,
  Switch,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "@/components/Toast/Toast";
import { getLocations } from "@/controllers/LocationController";
import {
  getAllTrucks,
  updateTruck,
  getTruckById,
} from "@/controllers/TruckController";
import { useMaterialTailwindController } from "@/context";

export const UpdateTruck = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const { id } = useParams();

  const [formData, setFormData] = useState({
    numberPlate: "",
    capacity: "",
    vehicleType: "",
    locations: [],
    Driver: {
      AddDriver: false,
      Drivername: "",
      DriverPhone: "",
      DriverLicense: "",
    },
  });

  const [errors, setErrors] = useState({
    numberPlate: "",
    capacity: "",
    vehicleType: "",
    Drivername: "",
    DriverPhone: "",
    DriverLicense: "",
  });

  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [driverAdd, setDriverAdd] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const retrievedLocations = await getLocations();
        setLocations(retrievedLocations);
        const TrackDetails = await getTruckById(id);
        setFormData(TrackDetails);
        console.log(TrackDetails);
        setSelectedLocations(TrackDetails.locations);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };

    fetchLocations();
  }, [id]);

  const validateNumberPlate = (numberPlate: string) => {
    const regex = /^[A-Za-z]{2,3}-\d{4}$/;
    return regex.test(numberPlate);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "numberPlate") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberPlate: validateNumberPlate(value)
          ? ""
          : "Invalid format. Example: VG-1234 or vsd-2134",
      }));
    } else if (name === "capacity") {
      const isValidCapacity = value !== "" && parseInt(value) >= 0;
      setErrors((prevErrors) => ({
        ...prevErrors,
        capacity: isValidCapacity
          ? ""
          : "Capacity must be greater than or equal to 0",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value
          ? ""
          : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
      }));
    }
  };

  const handleChangeDriver = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Driver: {
        ...prevData.Driver,
        [name]: value,
      },
    }));

    if (name === "DriverPhone") {
      const isDriverPhone =
        value !== "" && value.length === 10 && value.startsWith("07");
      setErrors((prevErrors) => ({
        ...prevErrors,
        DriverPhone: isDriverPhone
          ? ""
          : "Driver phone must be 10 characters long and start with 07",
      }));
    } else if (name === "DriverLicense") {
      const isDriverLicense = value !== "" && value.length === 8;
      setErrors((prevErrors) => ({
        ...prevErrors,
        DriverLicense: isDriverLicense
          ? ""
          : "Driver license must be 8 characters long",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value
          ? ""
          : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
      }));
    }
  };

  const handleVehicleTypeChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      vehicleType: value,
    }));
  };

  const handleLocationChange = (selected: any) => {
    setSelectedLocations((prevLocations) => [...prevLocations, selected]);
  };

  const removeLocation = (locationToRemove: string) => {
    setSelectedLocations((prevLocations) =>
      prevLocations.filter((location) => location !== locationToRemove)
    );
  };

  const isFormValid = () => {
    const isVehicleInfoValid =
      formData.numberPlate &&
      validateNumberPlate(formData.numberPlate) &&
      formData.capacity &&
      parseInt(formData.capacity) >= 0 &&
      formData.vehicleType;

    const isDriverInfoValid = driverAdd
      ? formData.Driver.Drivername &&
        formData.Driver.DriverPhone &&
        formData.Driver.DriverLicense &&
        !errors.Drivername &&
        !errors.DriverPhone &&
        !errors.DriverLicense
      : true;

    return (
      isVehicleInfoValid &&
      isDriverInfoValid &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }
    let finalFormData;
    if (driverAdd) {
      finalFormData = {
        ...formData,
        locations: selectedLocations.map((location) => location.id),
        Driver: {
          ...formData.Driver,
          AddDriver: driverAdd,
        },
      };
    } else {
      finalFormData = {
        ...formData,
        locations: selectedLocations.map((location) => location.id),
      };
    }
    try {
      await updateTruck(id, finalFormData);
      navigate("/dashboard/trucks");
      Toast("Truck Updated successfully", "success");
    } catch (error) {
      console.error("Failed to add truck", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Truck
        </Typography>
      </div>
      <div className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Number Plate
            </Typography>
            <input
              type="text"
              id="numberPlate"
              name="numberPlate"
              value={formData.numberPlate}
              onChange={handleChange}
              placeholder="e.g., VG-1234"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.numberPlate && (
              <Typography
                variant="small"
                color={
                  sidenavColor !== "dark"
                    ? sidenavColor !== "white"
                      ? sidenavColor
                      : "gray"
                    : "gray"
                }
              >
                {errors.numberPlate}
              </Typography>
            )}
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Capacity (kg or liters)
            </Typography>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 2000 kg"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.capacity && (
              <Typography
                variant="small"
                color={
                  sidenavColor !== "dark"
                    ? sidenavColor !== "white"
                      ? sidenavColor
                      : "gray"
                    : "gray"
                }
              >
                {errors.capacity}
              </Typography>
            )}
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Vehicle Type
            </Typography>
            <Select
              label="Select Vehicle Type"
              value={formData.vehicleType}
              onChange={(value) => handleVehicleTypeChange(value as string)}
            >
              <Option value="Compact">Compact</Option>
              <Option value="Flatbed">Flatbed</Option>
              <Option value="Dump Truck">Dump Truck</Option>
            </Select>
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Locations (Optional)
            </Typography>
            <Select
              multiple
              label="Select Locations"
              onChange={(value) => handleLocationChange(value as string)}
            >
              {locations.map((location, index) => (
                <Option key={index} value={location}>
                  {location.locationName}
                </Option>
              ))}
            </Select>

            <div className="flex flex-wrap mt-2">
              {selectedLocations.map((location, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 rounded-full px-2 py-1"
                >
                  {location.locationName}
                  <button
                    type="button"
                    onClick={() => removeLocation(location)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="Driver"
              label="Driver Details"
              checked={driverAdd}
              onChange={() => {
                setDriverAdd(!driverAdd);
              }}
              labelProps={{
                className: "text-sm font-normal text-blue-gray-500",
              }}
            />
          </div>
          {driverAdd && (
            <>
              <div className="space-y-2">
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Driver Name
                </Typography>
                <input
                  type="text"
                  id="Drivername"
                  name="Drivername"
                  value={formData.Driver.Drivername}
                  onChange={handleChangeDriver}
                  placeholder="e.g. Suriya Sivakumar"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.Drivername && (
                  <Typography
                    variant="small"
                    color={
                      sidenavColor !== "dark"
                        ? sidenavColor !== "white"
                          ? sidenavColor
                          : "gray"
                        : "gray"
                    }
                  >
                    {errors.Drivername}
                  </Typography>
                )}
              </div>

              <div className="space-y-2">
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Driver Licence
                </Typography>
                <input
                  type="text"
                  id="DriverLicense"
                  name="DriverLicense"
                  value={formData.Driver.DriverLicense}
                  onChange={handleChangeDriver}
                  placeholder="e.g. B1234567"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.DriverLicense && (
                  <Typography
                    variant="small"
                    color={
                      sidenavColor !== "dark"
                        ? sidenavColor !== "white"
                          ? sidenavColor
                          : "gray"
                        : "gray"
                    }
                  >
                    {errors.DriverLicense}
                  </Typography>
                )}
              </div>

              <div className="space-y-2">
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Driver Phone
                </Typography>
                <input
                  type="text"
                  id="DriverPhone"
                  name="DriverPhone"
                  value={formData.Driver.DriverPhone}
                  onChange={handleChangeDriver}
                  placeholder="e.g. 0729138920"
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.DriverPhone && (
                  <Typography
                    variant="small"
                    color={
                      sidenavColor !== "dark"
                        ? sidenavColor !== "white"
                          ? sidenavColor
                          : "gray"
                        : "gray"
                    }
                  >
                    {errors.DriverPhone}
                  </Typography>
                )}
              </div>
            </>
          )}

          <Button
            className="mt-6"
            color={
              sidenavColor !== "dark"
                ? sidenavColor !== "white"
                  ? sidenavColor
                  : "gray"
                : "gray"
            }
            fullWidth
            type="submit"
            disabled={!isFormValid()}
          >
            Save Truck
          </Button>
        </form>
      </div>
    </div>
  );
};
