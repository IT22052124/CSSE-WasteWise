import { generatePaymentID } from "../Controller/paymentController"; // Adjust the path as necessary
import * as firestore from "firebase/firestore"; // Import the Firestore methods

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
  };
});

describe("PaymentController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("generatePaymentID should return 'P0001' if no payments exist", async () => {
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: true,
    });

    const paymentID = await generatePaymentID();

    expect(paymentID).toBe("P0001");
    expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), "payments");
    expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
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
    expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), "payments");
    expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
  });

  test("generatePaymentID should throw an error if getDocs fails", async () => {
    (firestore.getDocs as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await expect(generatePaymentID()).rejects.toThrow("Network Error");
  });
});

