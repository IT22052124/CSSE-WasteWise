import { useEffect, useState } from "react";
import { db } from "../../storage/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const AddWasteType = () => {
  const [formData, setFormData] = useState({
    wasteType: "",
    description: "",
    guidelines: "",
    recyclable: false,
    incentives: "",
    binType: "",
    customBinColor: "",
  });

  const testQuery = async () => {
    try {
      const wasteTypeCollection = collection(db, "wasteTypes");
      const querySnapshot = await getDocs(wasteTypeCollection);

      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data()); // Logs each document's ID and data
      });
    } catch (error) {
      console.error("Error retrieving waste types: ", error);
    }
  };

  testQuery();

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await addDoc(collection(db, "wasteTypes"), {
        wasteType: formData.wasteType,
        description: formData.description,
        guidelines: formData.guidelines,
        recyclable: formData.recyclable,
        incentives: formData.incentives,
        binType: formData.customBinColor || formData.binType,
      });
      alert("Waste type added successfully!");
      setFormData({
        wasteType: "",
        description: "",
        guidelines: "",
        recyclable: false,
        incentives: "",
        binType: "",
        customBinColor: "",
      });
    } catch (error) {
      console.error("Error adding waste type: ", error);
      alert("Failed to add waste type.");
    }
  };

  return (
    <div id="webcrumbs" className="text-black">
      <div className="w-[500px] bg-white shadow-lg p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="wasteType"
              className="block text-sm font-title text-neutral-950"
            >
              Waste Type Name
            </label>
            <input
              id="wasteType"
              type="text"
              value={formData.wasteType}
              onChange={handleInputChange}
              placeholder="e.g., Organic Waste"
              className="w-full p-2 mt-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-title text-neutral-950"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Biodegradable materials such as food waste, yard waste, etc."
              className="w-full p-2 mt-2 border rounded-md"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="guidelines"
              className="block text-sm font-title text-neutral-950"
            >
              Disposal Guidelines
            </label>
            <textarea
              id="guidelines"
              value={formData.guidelines}
              onChange={handleInputChange}
              placeholder="e.g., Must be placed in green bins, collected weekly."
              className="w-full p-2 mt-2 border rounded-md"
              rows={3}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              id="recyclable"
              type="checkbox"
              checked={formData.recyclable}
              onChange={handleInputChange}
              className="h-4 w-4 rounded-xs"
            />
            <label
              htmlFor="recyclable"
              className="ml-2 block text-sm font-title text-neutral-950"
            >
              Recyclable Status
            </label>
          </div>
          <div className="mb-4">
            <label
              htmlFor="incentives"
              className="block text-sm font-title text-neutral-950"
            >
              Payback/Incentives
            </label>
            <input
              id="incentives"
              type="text"
              value={formData.incentives}
              onChange={handleInputChange}
              placeholder="e.g., None or Incentives for e-waste"
              className="w-full p-2 mt-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="binType"
              className="block text-sm font-title text-neutral-950"
            >
              Waste Bin Type/Color
            </label>
            <details className="relative text-black bg-white">
              <summary className="w-full p-2 mt-2 border rounded-md cursor-pointer">
                Select type/color
              </summary>
              <ul className="absolute mt-1 z-10 bg-white shadow-lg p-2 rounded-md">
                <li className="py-1 ">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        binType: "Green",
                        customBinColor: "",
                      })
                    }
                  >
                    Green
                  </button>
                </li>
                <li className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        binType: "Blue",
                        customBinColor: "",
                      })
                    }
                  >
                    Blue
                  </button>
                </li>
                <li className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        binType: "Red",
                        customBinColor: "",
                      })
                    }
                  >
                    Red
                  </button>
                </li>
                <li className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        binType: "Yellow",
                        customBinColor: "",
                      })
                    }
                  >
                    Yellow
                  </button>
                </li>
                <li className="py-1">
                  Custom
                  <input
                    type="text"
                    id="customBinColor"
                    value={formData.customBinColor}
                    onChange={handleInputChange}
                    placeholder="Enter custom color"
                    className="w-full p-1 mt-1 border rounded-md"
                  />
                </li>
              </ul>
            </details>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-title p-2 mt-4 rounded-md shadow"
          >
            Save Waste Type
          </button>
        </form>
      </div>
    </div>
  );
};
