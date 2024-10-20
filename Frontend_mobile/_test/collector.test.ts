import { getCollectorUsernames, getCollectorDetails } from "../controller/collectorController"; // Adjust the path as necessary
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import * as firestore from "firebase/firestore"; // Import the Firestore methods

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => {
  return {
    initializeApp: jest.fn(),
    getFirestore: jest.fn().mockReturnValue({}), // Mock the getFirestore function
    collection: jest.fn(), // Mock the collection function
    getDocs: jest.fn(), // Mock the getDocs function
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage");

describe("CollectorController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe("getCollectorUsernames", () => {
    test("should return an array of usernames when collectors are found", async () => {
      const mockCollectorData = [
        { id: "collector1", data: () => ({ username: "user1" }) },
        { id: "collector2", data: () => ({ username: "user2" }) },
      ];

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: (callback) => {
          mockCollectorData.forEach(callback);
        },
      });

      const result = await getCollectorUsernames();

      expect(result).toEqual(["user1", "user2"]);
      expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), "collector");
      expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
    });

    test("should return an empty array when no collectors are found", async () => {
      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: jest.fn(), // No collectors, so forEach does nothing
      });

      const result = await getCollectorUsernames();

      expect(result).toEqual([]); // Expect an empty array when no usernames
      expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
    });

    test("should throw an error if getDocs fails", async () => {
      (firestore.getDocs as jest.Mock).mockRejectedValueOnce(new Error("Firestore Error"));

      await expect(getCollectorUsernames()).rejects.toThrow("Failed to fetch usernames");
    });
  });

  describe("getCollectorDetails", () => {
    test("should return collector details when data is found", async () => {
      const mockCollector = { id: "collector1", username: "user1" };
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockCollector));

      const result = await getCollectorDetails();

      expect(result).toEqual(mockCollector);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("collector"); // Ensure getItem was called
    });

    test("should return undefined when no collector data is found", async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await getCollectorDetails();

      expect(result).toBeUndefined(); // Expect undefined when no data
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("collector"); // Ensure getItem was called
    });

    test("should handle errors gracefully", async () => {
      const mockError = new Error("AsyncStorage Error");
      AsyncStorage.getItem.mockRejectedValueOnce(mockError);

      // We don't expect any return since the error is caught, just make sure it doesn't throw
      await expect(getCollectorDetails()).resolves.toBeUndefined();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("collector"); // Ensure getItem was called
    });
  });
});
