import { Button, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { addLocation } from "@/controllers/LocationController";
import { useMaterialTailwindController } from "@/context";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getCollectionModels } from "@/controllers/CollectionModelController";

const customIcon = L.icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

export const AddLocation = () => {
  const [controller] = useMaterialTailwindController();
  const navigate = useNavigate();
  const { sidenavColor } = controller;
  const [formData, setFormData] = useState({
    locationName: "",
    collectionModel: "",
    latitude: "",
    longitude: "",
  });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchCollectionModels = async () => {
      try {
        const model = await getCollectionModels();
        console.log("Collection models:", model);
        setModels(model);
      } catch (error) {
        console.error("Failed to fetch collection models", error);
      }
    };
    fetchCollectionModels();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    } catch (error) {
      console.error("Error fetching place name:", error);
      setFormData({
        ...formData,
        locationName: "Failed to fetch place name",
      });
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      collectionModel: e.target.value,
    });
  };

  const handleMapClick = (latlng) => {
    console.log("Map clicked at:", latlng);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addLocation(formData);
      navigate("/dashboard/locations");
    } catch (error) {
      console.error("Failed to add location", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-1">
          Add New Location
        </Typography>
      </div>
      <div className="p-6">
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
              onChange={handleChange}
              placeholder="Click the map to select a location"
              readOnly
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Select Collection Model
            </Typography>
            <select
              id="binColor"
              name="binColor"
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select Collection Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.modelName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Select Location on Map
            </Typography>
            <MapContainer
              center={[7.8731, 80.7718]} // Coordinates of Sri Lanka
              zoom={7}
              scrollWheelZoom={false}
              className="h-64 w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
            </MapContainer>
          </div>

          {loading && (
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Fetching place name...
            </Typography>
          )}

          <Button
            className="mt-6"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            fullWidth
            type="submit"
            disabled={loading}
          >
            Save Location
          </Button>
        </form>
      </div>
    </div>
  );
};
