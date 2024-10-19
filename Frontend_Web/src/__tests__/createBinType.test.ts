import { createBinType } from "../controllers/BinTypeController"; // Adjust import as necessary
import * as firestore from "firebase/firestore";

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => ({
  initializeApp: jest.fn(),
  getFirestore: jest.fn().mockReturnValue({}), // Mock the getFirestore function
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(() => "mockTimestamp"),
}));

describe("BinTypeController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("createBinType should create a bin type successfully", async () => {
    const formData = {
      binType: "Recyclable",
      chargingPerKg: 5,
      incentivesPerKg: 2,
      selectedColor: "green",
    };

    (firestore.addDoc as jest.Mock).mockResolvedValueOnce({
      id: "mockBinTypeID",
    });

    const result = await createBinType(formData);

    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "binTypes"),
      expect.objectContaining({
        ...formData,
        createdAt: "mockTimestamp",
      })
    );
    expect(result).toEqual("mockBinTypeID");
  });

  test("createBinType should throw an error if creation fails", async () => {
    (firestore.addDoc as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await expect(createBinType({})).rejects.toThrow("Failed to create bin type");
  });
});
