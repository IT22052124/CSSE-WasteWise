import { createBinType } from "../src/controllers/BinTypeController"; // Adjust the path as needed
import * as firestore from "firebase/firestore";

import { db } from "../src/storage/firebase"; // This import can stay if you need the db instance

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => ({
  initializeApp: jest.fn(),
  getFirestore: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(() => "mockTimestamp"),
}));

describe("createBinType", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("should create a bin type successfully", async () => {
    // Mocking the addDoc function to resolve successfully
    firestore.addDoc.mockResolvedValueOnce({ id: "mockBinTypeID" });

    const formData = { name: "Plastic", color: "Blue" }; // Sample form data
    const result = await createBinType(formData);

    // Assertions
    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "binTypes"),
      expect.objectContaining({
        ...formData,
        createdAt: "mockTimestamp", // Check that createdAt is included
      })
    );
    expect(result).toBe("mockBinTypeID"); // Check that the correct ID is returned
  });

  test("should throw an error when bin type creation fails", async () => {
    // Simulate an error in addDoc
    firestore.addDoc.mockRejectedValueOnce(new Error("Firestore error"));

    // Expect the function to throw an error
    await expect(
      createBinType({ name: "Plastic", color: "Blue" })
    ).rejects.toThrow("Failed to create bin type");

    // Check if error was logged
    expect(console.error).toHaveBeenCalledWith(
      "Error creating bin type:",
      expect.any(Error)
    );
  });
});
