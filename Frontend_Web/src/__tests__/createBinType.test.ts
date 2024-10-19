import { createBinType, getBinTypes } from "../controllers/BinTypeController"; // Adjust import as necessary
import * as firestore from "firebase/firestore";

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => ({
  initializeApp: jest.fn(),
  getFirestore: jest.fn().mockReturnValue({}), // Mock the getFirestore function
  addDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
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
    (firestore.addDoc as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(createBinType({})).rejects.toThrow(
      "Failed to create bin type"
    );
  });

  test("getBinTypes should retrieve bin types successfully", async () => {
    // Mocking the return value of getDocs for bin types
    const mockDocs = [
      {
        id: "b1",
        data: () => ({
          binType: "Recyclable",
          chargingPerKg: 5,
          incentivesPerKg: 2,
          selectedColor: "green",
        }),
      },
      {
        id: "b2",
        data: () => ({
          binType: "Organic",
          chargingPerKg: 3,
          incentivesPerKg: 1,
          selectedColor: "brown",
        }),
      },
    ];

    // Ensure collection function returns a mock value to be used by getDocs
    const mockCollection = "mockedCollection";
    (firestore.collection as jest.Mock).mockReturnValue(mockCollection);

    // Mock the return value of getDocs
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      docs: mockDocs,
    });

    const result = await getBinTypes();

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "binTypes"
    );
    expect(firestore.getDocs).toHaveBeenCalledWith(mockCollection);
    expect(result).toEqual([
      {
        id: "b1",
        binType: "Recyclable",
        chargingPerKg: 5,
        incentivesPerKg: 2,
        selectedColor: "green",
      },
      {
        id: "b2",
        binType: "Organic",
        chargingPerKg: 3,
        incentivesPerKg: 1,
        selectedColor: "brown",
      },
    ]);
  });

  test("getBinTypes should throw an error if retrieval fails", async () => {
    (firestore.getDocs as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(getBinTypes()).rejects.toThrow("Failed to retrieve bin types");
  });
});
