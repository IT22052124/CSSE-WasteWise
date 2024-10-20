import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import {
    addBin,
    getBins,
  } from "../controllers/BinsController"; // Adjust the import path as necessary
  
  // Mock Firebase Firestore methods
  jest.mock("firebase/firestore", () => ({
    initializeApp: jest.fn(),
    getFirestore: jest.fn(),
    addDoc: jest.fn() as jest.Mock,
    collection: jest.fn() as jest.Mock,
    getDocs: jest.fn() as jest.Mock,
    doc: jest.fn() as jest.Mock,
    updateDoc: jest.fn() as jest.Mock,
    serverTimestamp: jest.fn(() => "mockTimestamp"),
  }));
  
  describe("BinsController", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mocks before each test
      (collection as jest.Mock).mockReturnValue("mockCollectionRef"); // Mock collection reference
      jest.spyOn(console, "error").mockImplementation(jest.fn()); // Mock console.error
    });
  
    afterEach(() => {
      jest.restoreAllMocks(); // Restore mocks after each test
    });
  
    describe("addBin", () => {
      test("should add a new bin successfully", async () => {
        const binData = { userRef: "user123", wasteTypeRef: "type123" };
        const mockAddDoc = jest.fn().mockResolvedValue({ id: "mockBinID" });
        (addDoc as jest.Mock).mockImplementation(mockAddDoc);
        (doc as jest.Mock).mockReturnValue("mockDocRef"); // Mock document references
  
        const result = await addBin(binData);
  
        // Assertions
        expect(addDoc).toHaveBeenCalledWith("mockCollectionRef", {
          ...binData,
          userRef: "mockDocRef", // Check if userRef is a doc reference
          wasteTypeRef: "mockDocRef", // Check if wasteTypeRef is a doc reference
          wasteLevel: 0, // Initial waste level
          createdAt: "mockTimestamp", // Check if createdAt is set
        });
        expect(result).toEqual({ id: "mockBinID" }); // Expect the returned ID
      });
  
      test("should throw an error when adding a bin fails", async () => {
        const binData = { userRef: "user123", wasteTypeRef: "type123" };
        (addDoc as jest.Mock).mockRejectedValueOnce(new Error("Firestore error"));
  
        await expect(addBin(binData)).rejects.toThrow("Firestore error");
  
        // Check if error was logged
        expect(console.error).toHaveBeenCalledWith("Error adding bin:", expect.any(Error));
      });
    });
  
    describe("getBins", () => {
      test("should retrieve all bins successfully", async () => {
        const mockGetDocs = jest.fn().mockResolvedValue({
          docs: [
            { id: "bin1", data: () => ({ wasteLevel: 10 }) },
            { id: "bin2", data: () => ({ wasteLevel: 20 }) },
          ],
        });
        (getDocs as jest.Mock).mockImplementation(mockGetDocs);
  
        const result = await getBins();
  
        // Expect the getDocs to be called correctly
        expect(getDocs).toHaveBeenCalledWith("mockCollectionRef");
        expect(result).toEqual([
          { id: "bin1", wasteLevel: 10 },
          { id: "bin2", wasteLevel: 20 },
        ]); // Check the expected output
      });
  
      test("should throw an error when fetching bins fails", async () => {
        (getDocs as jest.Mock).mockRejectedValueOnce(new Error("Firestore error"));
  
        await expect(getBins()).rejects.toThrow("Failed to fetch bins");
        expect(console.error).toHaveBeenCalledWith("Error retrieving bins:", expect.any(Error));
      });
    });
  });
  