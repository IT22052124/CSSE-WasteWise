import {
  addCollectionModel,
  getCollectionModels,
  updateCollectionModel,
  deleteCollectionModel,
  getCollectionModelById,
} from "../controllers/CollectionModelController"; // Adjust the import path as needed
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

describe("CollectionModelController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("addCollectionModel should add a collection model successfully", async () => {
    (firestore.addDoc as jest.Mock).mockResolvedValueOnce({
      id: "mockCollectionModelID",
    });

    const collectionModelData = { name: "Model A", description: "Test model" };
    const result = await addCollectionModel(collectionModelData);

    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "collectionModels"),
      expect.objectContaining({
        ...collectionModelData,
        locations: [],
        createdAt: "mockTimestamp",
      })
    );
    expect(result).toEqual({ id: "mockCollectionModelID" });
  });

  test("addCollectionModel should throw an error on network failure", async () => {
    (firestore.addDoc as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const collectionModelData = { name: "Model A", description: "Test model" };

    await expect(addCollectionModel(collectionModelData)).rejects.toThrow(
      "Network Error"
    );
  });


  test("getCollectionModels should throw an error on network failure", async () => {
    (firestore.getDocs as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(getCollectionModels()).rejects.toThrow(
      "Failed to fetch collection models"
    );
  });

  test("updateCollectionModel should update a collection model successfully", async () => {
    const collectionModelId = "mockCollectionModelID";
    const updatedCollectionModelData = { name: "Updated Model A" };

    await updateCollectionModel(collectionModelId, updatedCollectionModelData);

    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(expect.anything(), "collectionModels", collectionModelId),
      expect.objectContaining({
        ...updatedCollectionModelData,
        updatedAt: "mockTimestamp",
      })
    );
  });

  test("updateCollectionModel should throw an error on network failure", async () => {
    const collectionModelId = "mockCollectionModelID";
    const updatedCollectionModelData = { name: "Updated Model A" };

    (firestore.updateDoc as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(
      updateCollectionModel(collectionModelId, updatedCollectionModelData)
    ).rejects.toThrow("Network Error");
  });

  test("deleteCollectionModel should delete a collection model successfully", async () => {
    const collectionModelId = "mockCollectionModelID";

    await deleteCollectionModel(collectionModelId);

    expect(firestore.deleteDoc).toHaveBeenCalledWith(
      firestore.doc(expect.anything(), "collectionModels", collectionModelId)
    );
  });

  test("deleteCollectionModel should throw an error on network failure", async () => {
    const collectionModelId = "mockCollectionModelID";

    (firestore.deleteDoc as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(deleteCollectionModel(collectionModelId)).rejects.toThrow(
      "Network Error"
    );
  });

  test("getCollectionModelById should throw an error on network failure", async () => {
    const collectionModelId = "mockCollectionModelID";
    (firestore.getDoc as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch collection model by ID")
    );

    await expect(getCollectionModelById(collectionModelId)).rejects.toThrow(
      "Failed to fetch collection model by ID"
    );
  });
});
