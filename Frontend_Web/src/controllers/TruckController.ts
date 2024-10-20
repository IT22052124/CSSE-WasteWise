import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../storage/firebase";

// Helper function to generate the next truck ID (Tru-001, Tru-002, etc.)
export const generateTruckId = async () => {
  const q = query(collection(db, "trucks"), orderBy("truckId", "desc"));
  const truckSnapshot = await getDocs(q);

  let lastTruckId = "Tru-000";
  if (!truckSnapshot.empty) {
    lastTruckId = truckSnapshot.docs[0].data().truckId;
  }

  const numericPart = parseInt(lastTruckId.split("-")[1], 10) + 1;
  return `Tru-${numericPart.toString().padStart(3, "0")}`;
};

// Add a new truck
export const addTruck = async (truckData) => {
  try {
    const truckId = await generateTruckId(); // Generate truck ID
    const docRef = await addDoc(collection(db, "trucks"), {
      ...truckData,
      truckId,
      locations: truckData.locations || [], // Handle locations being null or an array
      createdAt: serverTimestamp(),
      employees: [],
    });
    console.log("Truck added with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding truck: ", e);
    throw e;
  }
};

// Get all trucks
export const getAllTrucks = async () => {
  try {
    const trucksCollection = collection(db, "trucks");
    const trucksSnapshot = await getDocs(trucksCollection);

    const trucks = await Promise.all(
      trucksSnapshot.docs.map(async (docSnapshot) => {
        const truckData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };

        // Fetch locations if they exist
        if (truckData.locations && truckData.locations.length > 0) {
          truckData.locations = await Promise.all(
            truckData.locations.map(async (locationId) => {
              const locationRef = doc(db, "locations", locationId);
              const locationDoc = await getDoc(locationRef);
              return locationDoc.exists()
                ? { id: locationDoc.id, ...locationDoc.data() }
                : null;
            })
          );
        }

        // Fetch employee details from 'collectors' collection
        if (truckData.employees && truckData.employees.length > 0) {
          truckData.employees = await Promise.all(
            truckData.employees.map(async (employeeId) => {
              // Debugging step: log the employeeId

              // Check if the employeeId is valid
              if (!employeeId || typeof employeeId !== "string") {
                return null;
              }

              const employeeRef = doc(db, "collectors", employeeId); // Ensure full reference
              const employeeDoc = await getDoc(employeeRef);
              return employeeDoc.exists()
                ? { id: employeeDoc.id, ...employeeDoc.data() }
                : null;
            })
          );
        }

        return truckData;
      })
    );

    return trucks;
  } catch (error) {
    console.error("Error retrieving trucks:", error);
    throw new Error("Failed to fetch trucks");
  }
};

// Update a truck by ID
export const updateTruck = async (id, updatedTruckData) => {
  try {
    const truckRef = doc(db, "trucks", id);
    await updateDoc(truckRef, {
      ...updatedTruckData,
      locations: updatedTruckData.locations || [], // Handle locations being null or an array
      updatedAt: serverTimestamp(),
    });
    console.log("Truck updated with ID: ", id);
  } catch (e) {
    console.error("Error updating truck: ", e);
    throw e;
  }
};

// Delete a truck by ID
export const deleteTruck = async (id) => {
  try {
    const truckRef = doc(db, "trucks", id);
    await deleteDoc(truckRef);
    console.log("Truck deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting truck: ", e);
    throw e;
  }
};

export const getTruckById = async (id) => {
  try {
    const truckRef = doc(db, "trucks", id);
    const truckDoc = await getDoc(truckRef);

    if (truckDoc.exists()) {
      let truckData = {
        id: truckDoc.id,
        ...truckDoc.data(),
      };

      // Fetch locations if they exist
      if (truckData.locations && truckData.locations.length > 0) {
        truckData.locations = await Promise.all(
          truckData.locations.map(async (locationId) => {
            const locationRef = doc(db, "locations", locationId);
            const locationDoc = await getDoc(locationRef);
            return locationDoc.exists()
              ? { id: locationDoc.id, ...locationDoc.data() }
              : null;
          })
        );
      }

      // Fetch employee details from 'collectors' collection
      if (truckData.employees && truckData.employees.length > 0) {
        truckData.employees = await Promise.all(
          truckData.employees.map(async (employeeId) => {
            // Check if the employeeId is valid
            if (!employeeId || typeof employeeId !== "string") {
              return null;
            }

            const employeeRef = doc(db, "collectors", employeeId);
            const employeeDoc = await getDoc(employeeRef);
            return employeeDoc.exists()
              ? { id: employeeDoc.id, ...employeeDoc.data() }
              : null;
          })
        );
      }

      console.log("Truck retrieved successfully:", truckData);
      return truckData;
    } else {
      console.log("No such document!");
      throw new Error("Truck not found");
    }
  } catch (error) {
    console.error("Error retrieving truck:", error);
    throw new Error("Failed to fetch truck by ID");
  }
};

export const updateTruckEmployees = async (truckId, employees) => {
  try {
    const truckRef = doc(db, "trucks", truckId);

    const employeeList = Array.isArray(employees) ? employees : [employees];

    await updateDoc(truckRef, {
      employees: employeeList,
      updatedAt: serverTimestamp(),
    });

    console.log(`Truck ${truckId} employees updated successfully.`);
  } catch (e) {
    console.error("Error updating truck employees: ", e);
    throw e;
  }
};

export const getTruckCount = async () => {
  try {
    const trucks = await getAllTrucks(); // Reuse the existing function to get all trucks
    return trucks.length; // Return the count of trucks
  } catch (error) {
    console.error("Error retrieving truck count:", error);
    throw new Error("Failed to fetch truck count");
  }
};
