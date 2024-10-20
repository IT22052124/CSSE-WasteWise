import { findBinByID, resetBinWasteLevel } from "../controller/BinController"; // Adjust the path as necessary
import * as firestore from "firebase/firestore"; // Import the Firestore methods

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => {
  return {
    initializeApp: jest.fn(),
    getFirestore: jest.fn().mockReturnValue({}), // Mock the getFirestore function
    collection: jest.fn(), // Mock the collection function
    query: jest.fn(), // Mock the query function
    where: jest.fn(), // Mock the where function
    getDocs: jest.fn(), // Mock the getDocs function
    doc: jest.fn(), // Mock the doc function
    updateDoc: jest.fn(), // Mock the updateDoc function
  };
});

describe("BinController", () => {
  const mockBinID = "bin123";
  const mockBinDocRef = { id: mockBinID };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe("findBinByID", () => {
    test("should return bin data when bin is found by binID", async () => {
      const mockBinData = {
        binID: mockBinID,
        wasteLevel: 50,
        type: "recyclable",
      };

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            id: "binDocID",
            data: () => mockBinData,
          },
        ],
      });

      const result = await findBinByID(mockBinID);

      expect(result).toEqual({
        id: "binDocID",
        ...mockBinData,
      });
      expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), "bins");
      expect(firestore.where).toHaveBeenCalledWith("binID", "==", mockBinID);
      expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
    });

    test("should return null when no bin is found", async () => {
      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        empty: true,
        docs: [],
      });

      const result = await findBinByID(mockBinID);

      expect(result).toBeNull();
      expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
    });

    test("should throw an error if getDocs fails", async () => {
      (firestore.getDocs as jest.Mock).mockRejectedValueOnce(new Error("Firestore Error"));

      await expect(findBinByID(mockBinID)).rejects.toThrow("Failed to fetch bin by binID");
    });
  });

  describe("resetBinWasteLevel", () => {
    test("should successfully reset the waste level of the bin", async () => {
      (firestore.doc as jest.Mock).mockReturnValue(mockBinDocRef);

      await resetBinWasteLevel(mockBinID);

      expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), "bins", mockBinID);
      expect(firestore.updateDoc).toHaveBeenCalledWith(mockBinDocRef, { wasteLevel: 0 });
    });

    test("should throw an error if updateDoc fails", async () => {
      (firestore.updateDoc as jest.Mock).mockRejectedValueOnce(new Error("Firestore Error"));

      await expect(resetBinWasteLevel(mockBinID)).rejects.toThrow("Failed to reset waste level");
    });
  });
});
