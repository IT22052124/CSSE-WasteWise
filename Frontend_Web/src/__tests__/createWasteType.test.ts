import {
  addWasteType,
  getWasteTypesWithBinInfo,
  updateWasteType,
  deleteWasteType,
  getWasteTypeById,
} from "../controllers/WasteTypeController";
import * as firestore from "firebase/firestore";

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => ({
  initializeApp: jest.fn(),
  getFirestore: jest.fn(),
  addDoc: jest.fn() as jest.Mock,
  collection: jest.fn() as jest.Mock,
  getDocs: jest.fn() as jest.Mock,
  updateDoc: jest.fn() as jest.Mock,
  deleteDoc: jest.fn() as jest.Mock,
  doc: jest.fn() as jest.Mock,
  getDoc: jest.fn() as jest.Mock,
  serverTimestamp: jest.fn(() => "mockTimestamp"),
}));

describe("WasteTypeController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("addWasteType should add a waste type successfully", async () => {
    // Mock the addDoc function to resolve successfully
    (firestore.addDoc as jest.Mock).mockResolvedValueOnce({
      id: "mockWasteTypeID",
    });

    const wasteTypeData = {
      wasteType: "Plastic",
      description: "Plastic waste",
    };
    const result = await addWasteType(wasteTypeData);

    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "wasteTypes"),
      expect.objectContaining({
        ...wasteTypeData,
        createdAt: "mockTimestamp",
      })
    );
    expect(result).toEqual({ id: "mockWasteTypeID" });
  });

  test("getWasteTypesWithBinInfo should retrieve waste types with bin info", async () => {
    // Mocking the return values of getDocs for waste types
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        { id: "1", data: () => ({ wasteType: "Plastic" }) },
        { id: "2", data: () => ({ wasteType: "Organic" }) },
      ],
    });

    // Mocking the return values of getDocs for bin types
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        {
          id: "b1",
          data: () => ({
            wasteTypes: ["Plastic"],
            binType: "Bin A",
            chargingPerKg: 10,
            incentivesPerKg: 5,
            selectedColor: "blue",
          }),
        },
      ],
    });

    const result = await getWasteTypesWithBinInfo();

    expect(result).toEqual([
      {
        id: "1",
        wasteType: "Plastic",
        binType: "Bin A",
        chargingPerKg: 10,
        incentivesPerKg: 5,
        selectedColor: "blue",
        Bin: true, // Include this to match the expected output
      },
      { id: "2", wasteType: "Organic" },
    ]);
  });

  test("updateWasteType should update a waste type successfully", async () => {
    const wasteTypeId = "mockWasteTypeID";
    const updatedWasteTypeData = { wasteType: "Updated Plastic" };

    await updateWasteType(wasteTypeId, updatedWasteTypeData);

    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(expect.anything(), "wasteTypes", wasteTypeId),
      expect.objectContaining({
        ...updatedWasteTypeData,
        updatedAt: "mockTimestamp",
      })
    );
  });

  test("deleteWasteType should delete a waste type successfully", async () => {
    const wasteTypeId = "mockWasteTypeID";

    await deleteWasteType(wasteTypeId);

    expect(firestore.deleteDoc).toHaveBeenCalledWith(
      firestore.doc(expect.anything(), "wasteTypes", wasteTypeId)
    );
  });

  test("getWasteTypeById should retrieve a waste type by ID", async () => {
    const wasteTypeId = "KB32ZVHSUL6UQQpEcWeX";
    (firestore.getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      id: wasteTypeId,
      data: () => ({ wasteType: "Organic Waste", description: "ewggw" }),
    });

    const result = await getWasteTypeById(wasteTypeId);

    expect(result).toEqual({
      id: wasteTypeId,
      wasteType: "Organic Waste",
      description: "ewggw",
    });
  });

  test("getWasteTypeById should throw an error if waste type does not exist", async () => {
    const wasteTypeId = "mockWasteTypeID";
    (firestore.getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => false,
    });

    await expect(getWasteTypeById(wasteTypeId)).rejects.toThrow(
      "Waste type not found" 
    );
  });
});
