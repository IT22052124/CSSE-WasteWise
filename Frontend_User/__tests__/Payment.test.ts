import {
  generatePaymentID,
  getTotalPaymentByUserID,
  getWasteCollectionsByUserID,
} from "../Controller/paymentController";
import * as firestore from "firebase/firestore";

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => {
  return {
    initializeApp: jest.fn(),
    getFirestore: jest.fn().mockReturnValue({}), // Mock the getFirestore function
    collection: jest.fn(), // Mock the collection function
    query: jest.fn(), // Mock the query function
    orderBy: jest.fn(), // Mock the orderBy function
    getDocs: jest.fn(), // Mock the getDocs function
    limit: jest.fn(), // Mock the limit function
    serverTimestamp: jest.fn(),
    doc: jest.fn(),
    where: jest.fn(),
  };
});

describe("PaymentController", () => {
  const userID = "user123";
  const mockUserRef = {};
  const mockUserRef2 = { path: "users/user123" };
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("generatePaymentID should return 'P0001' if no payments exist", async () => {
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: true,
    });

    const paymentID = await generatePaymentID();

    expect(paymentID).toBe("P0001");
    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "payments"
    );
    expect(firestore.getDocs).toHaveBeenCalled();
  });

  test("generatePaymentID should return the next payment ID if payments exist", async () => {
    const mockDocs = [
      {
        id: "1",
        data: () => ({
          paymentID: "P0003", // Simulating an existing payment ID
        }),
      },
    ];

    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: mockDocs,
    });

    const paymentID = await generatePaymentID();

    expect(paymentID).toBe("P0004"); // Expect the next payment ID
    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "payments"
    );
    expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
  });

  test("generatePaymentID should throw an error if getDocs fails", async () => {
    (firestore.getDocs as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(generatePaymentID()).rejects.toThrow("Network Error");
  });

  test("getTotalPaymentByUserID should return total payment for a user", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef); // Mock the user document reference

    // Mock the getDocs return value
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        { data: () => ({ amount: 100 }) }, // Mock payment document with amount 100
        { data: () => ({ amount: 200 }) }, // Mock payment document with amount 200
      ],
    });

    const result = await getTotalPaymentByUserID(userID);

    expect(result).toBe(300); // Expect total payment to be 300
    expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
  });

  test("getTotalPaymentByUserID should return 0 if no payments exist", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef); // Mock the user document reference

    // Mock the getDocs return value to indicate no payments
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [],
    });

    const result = await getTotalPaymentByUserID(userID);

    expect(result).toBe(0); // Expect total payment to be 0
  });
  test("getTotalPaymentByUserID should return 0 if no payments exist", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef); // Mock the user document reference

    // Mock the getDocs return value to indicate no payments
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [],
    });

    const result = await getTotalPaymentByUserID(userID);

    expect(result).toBe(0); // Expect total payment to be 0
  });

  test("getTotalPaymentByUserID should handle errors gracefully", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef); // Mock the user document reference

    // Mock getDocs to throw an error
    (firestore.getDocs as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(getTotalPaymentByUserID(userID)).rejects.toThrow(
      "Failed to retrieve total payment"
    );
  });

  test("getWasteCollectionsByUserID should return waste collection data successfully", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef2); // Mock the user document reference

    // Mock the Firestore documents returned for waste collection
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          data: () => ({
            PerKg: 10,
            Payback: 2,
            wasteWeight: 5,
            collectedAt: { toDate: () => new Date("2024-10-05") },
          }),
        },
        {
          data: () => ({
            PerKg: 15,
            Payback: 3,
            wasteWeight: 3,
            collectedAt: { toDate: () => new Date("2024-10-10") },
          }),
        },
      ],
    });

    const result = await getWasteCollectionsByUserID(userID);

    // Expected total calculations
    const expectedResult = [
      {
        userRef: "users/user123",
        month: "October 2024",
        totalAmount: 95, // (10 * 5) + (15 * 3)
        totalPayBackAmount: 19, // (2 * 5) + (3 * 3)
        totalWaste: 8, // 5 + 3
        totalAmountToBePaid: 76, // totalAmount - totalPayBackAmount
      },
    ];

    expect(result).toEqual(expectedResult); // This test should pass
  });

  test("getWasteCollectionsByUserID should return an empty array if no waste collections exist", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef); // Mock the user document reference

    // Mock the Firestore documents returned for waste collection
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: true,
      docs: [],
    });

    const result = await getWasteCollectionsByUserID(userID);

    expect(result).toEqual([]); // Expect an empty array
    expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
  });

  test("getWasteCollectionsByUserID should skip negative amount calculations", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef2); // Mock the user document reference

    // Mock the Firestore documents returned for waste collection with negative PerKg
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          data: () => ({
            PerKg: -5, // Negative PerKg
            Payback: 2,
            wasteWeight: 10,
            collectedAt: { toDate: () => new Date("2024-10-05") },
          }),
        },
        {
          data: () => ({
            PerKg: 5,
            Payback: 2,
            wasteWeight: 10,
            collectedAt: { toDate: () => new Date("2024-10-10") },
          }),
        },
      ],
    });

    const result = await getWasteCollectionsByUserID(userID);

    // Expected total calculations (only the valid entry counts)
    const expectedResult = [
      {
        userRef: "users/user123",
        month: "October 2024",
        totalAmount: 50, // (5 * 10)
        totalPayBackAmount: 20, // (2 * 10)
        totalWaste: 10, // 10
        totalAmountToBePaid: 30, // totalAmount - totalPayBackAmount
      },
    ];

    expect(result).toEqual(expectedResult); // This test should pass
  });

  test("getWasteCollectionsByUserID should skip calculations if payback amount is negative", async () => {
    (firestore.doc as jest.Mock).mockReturnValue(mockUserRef2); // Mock the user document reference

    // Mock the Firestore documents returned for waste collection with negative Payback
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          data: () => ({
            PerKg: 5,
            Payback: -2, // Negative Payback
            wasteWeight: 10,
            collectedAt: { toDate: () => new Date("2024-10-05") },
          }),
        },
        {
          data: () => ({
            PerKg: 5,
            Payback: 2,
            wasteWeight: 10,
            collectedAt: { toDate: () => new Date("2024-10-10") },
          }),
        },
      ],
    });

    const result = await getWasteCollectionsByUserID(userID);

    // Expected total calculations (only the valid entry counts)
    const expectedResult = [
      {
        userRef: "users/user123",
        month: "October 2024",
        totalAmount: 50, // (5 * 10)
        totalPayBackAmount: 20, // (2 * 10)
        totalWaste: 10, // 10
        totalAmountToBePaid: 30, // totalAmount - totalPayBackAmount
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});
