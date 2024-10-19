import { Button, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  updateLocation,
  getLocationById,
  getLocations,
} from "@/controllers/LocationController"; // Add a method to fetch location by ID
import { useMaterialTailwindController } from "@/context";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getCollectionModels } from "@/controllers/CollectionModelController";
import Toast from "@/components/Toast/Toast";

const customIcon = L.icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

export const UpdateLocation = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const [formData, setFormData] = useState({
    locationName: "",
    collectionModel: "",
    latitude: "",
    longitude: "",
  });
  const { id } = useParams(); // Get location ID from URL parameters
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [errors, setErrors] = useState({
    locationName: "",
    collectionModel: "",
    map: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchCollectionModels = async () => {
      try {
        const model = await getCollectionModels();
        const loc = await getLocations();
        setModels(model);
        setLocations(loc);
      } catch (error) {
        console.error("Failed to fetch collection models", error);
      }
    };

    const fetchLocationData = async () => {
      try {
        const locationData = await getLocationById(id); // Fetch location data by ID
        console.log("Location data:", locationData);
        setFormData(locationData);
        setSelectedPosition({
          lat: locationData.latitude,
          lng: locationData.longitude,
        });
      } catch (error) {
        console.error("Failed to fetch location data", error);
      }
    };

    fetchCollectionModels();
    fetchLocationData();
  }, [id]); // Fetch data when component mounts or ID changes

  useEffect(() => {
    const isFormValid =
      formData.collectionModel && selectedPosition && !errors.locationName;
    setIsFormValid(isFormValid);
  }, [formData, selectedPosition, errors]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (field, value) => {
    let error = "";
    if (field === "collectionModel" && !value) {
      error = "Please select a collection model.";
    }

    if (field === "locationName") {
      const isLocationTaken = locations.some(
        (loc) =>
          loc.locationName.toLowerCase() === value.toLowerCase() &&
          loc.id !== id
      );
      if (isLocationTaken) {
        error = "This location name is already taken.";
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const fetchPlaceName = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const placeName =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "Unknown location";
      setFormData((prevData) => ({
        ...prevData,
        locationName: placeName,
        latitude: lat,
        longitude: lng,
      }));
      setLoading(false);
      if (placeName === "Unknown location") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          locationName: "Unknown location. Please click somewhere else!",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          locationName: "",
          map: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching place name:", error);
      setFormData({
        ...formData,
        locationName: "Unknown location",
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        locationName: "Unknown location. Please click somewhere else!",
      }));
      setLoading(false);
    }
  };

  const fetchLatLngByPlaceName = async (placeName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          toPascalCase(placeName)
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSelectedPosition({
          lat: lat,
          lng: lon,
        });
        setFormData((prevData) => ({
          ...prevData,
          latitude: lat,
          longitude: lon,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          locationName: "",
        }));
        validateField("locationName", placeName);
      } else {
        if (placeName !== "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            locationName:
              "Location not found. Please enter a valid place name!",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            locationName: "Please select a location on the map Or Search !",
          }));
        }
        setSelectedPosition(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        locationName: "An error occurred while fetching the location.",
      }));
      setLoading(false);
    }
  };

  const onChangeLocationSearch = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: toPascalCase(e.target.value),
    });
    fetchLatLngByPlaceName(e.target.value);
  };

  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng);
    fetchPlaceName(latlng.lat, latlng.lng);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng);
      },
    });
    return selectedPosition === null ? null : (
      <Marker position={selectedPosition} icon={customIcon} />
    );
  };
  const toPascalCase = (str) => {
    return str
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  };

  const validateForm = () => {
    let valid = true;
    if (!formData.collectionModel) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        collectionModel: "Please select a collection model.",
      }));
      valid = false;
    }
    if (!selectedPosition) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        map: "Please select a location on the map.",
      }));
      valid = false;
    }
    // Validate if map clicked position and search result mismatch
    if (
      selectedPosition &&
      (selectedPosition.lat !== formData.latitude ||
        selectedPosition.lng !== formData.longitude)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        map: "The clicked map location does not match the searched location.",
      }));
      valid = false;
    }
    return valid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await updateLocation(id, formData); // Call updateLocation with ID and formData
        navigate("/dashboard/locations");
        Toast("Location Updated Successfully !", "success");
      } catch (error) {
        console.error("Failed to add location", error);
      }
    }
  };
  return (
    <div className="flex w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="w-1/2 p-6 space-y-4">
        <div className="px-4 border-b border-gray-200">
          <Typography variant="h5" color="blue-gray" className="mb-1">
            Update Location
          </Typography>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Location Name (Auto-fetched)
            </Typography>
            <input
              type="text"
              id="locationName"
              name="locationName"
              value={formData.locationName}
              onChange={onChangeLocationSearch}
              placeholder="Enter a location name"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.locationName && (
              <Typography
                variant="small"
                color={
                  sidenavColor !== "dark"
                    ? sidenavColor !== "white"
                      ? sidenavColor
                      : "gray"
                    : "gray"
                }
                className="font-normal"
              >
                {errors.locationName}
              </Typography>
            )}
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Select Collection Model
            </Typography>
            <select
              id="collectionModel"
              name="collectionModel"
              value={formData.collectionModel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select Collection Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.modelName}
                </option>
              ))}
            </select>
            {errors.collectionModel && (
              <Typography
                variant="small"
                color={
                  sidenavColor !== "dark"
                    ? sidenavColor !== "white"
                      ? sidenavColor
                      : "gray"
                    : "gray"
                }
                className="font-normal"
              >
                {errors.collectionModel}
              </Typography>
            )}
          </div>
          {loading && (
            <Typography variant="small" className="font-normal" color="gray">
              Fetching place name...
            </Typography>
          )}
          <Button
            className="mt-6"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            fullWidth
            type="submit"
            disabled={loading || !isFormValid}
          >
            Update Location
          </Button>
        </form>
      </div>
      <div className="w-1/2">
        <MapContainer
          center={selectedPosition || [7.8731, 80.7718]} // Center on existing position or default
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: "500px", width: "100%" }} // Adjust height here
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
        </MapContainer>
        {errors.map && (
          <Typography
            variant="small"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            className="font-normal mt-2"
          >
            {errors.map}
          </Typography>
        )}
      </div>
    </div>
  );
};
