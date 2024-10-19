import { createPayment } from "../Controller/paymentController"; // Adjust the path as needed
import { db } from '../storage/firebase'; // This import can stay if you need the db instance
import * as firestore from 'firebase/firestore';

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => ({
  initializeApp: jest.fn(),
  getFirestore: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  Timestamp: {
    now: jest.fn(() => "mockTimestamp"),
  },
}));

describe("createPayment", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    firestore.addDoc.mockClear(); // Clear the specific mock if needed
  });

  test("should create a payment successfully with card method", async () => {
    // Mock the payment ID directly without calling the function
    const mockPaymentID = "mockPaymentID";

    // Mock Firebase doc and addDoc behavior
    const mockDoc = { id: "mockUserID" };
    firestore.doc.mockReturnValue(mockDoc);
    firestore.addDoc.mockResolvedValueOnce({ id: "mockPaymentDocID" });

    // Call the function and test the outcome
    await createPayment(100, "mockUserID", "card", null);

    // Assertions
    expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), "users", "mockUserID");
    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "payments"),
      expect.objectContaining({
        paymentID: mockPaymentID, // Use mocked payment ID directly
        amount: 100,
        userID: mockDoc,
        date: "mockTimestamp",
        method: "card",
        status: "Success",
        slipUrl: null,
      })
    );
  });

  test("should create a payment successfully with bank method", async () => {
    // Mock the payment ID directly without calling the function
    const mockPaymentID = "mockPaymentID";

    const mockDoc = { id: "mockUserID" };
    firestore.doc.mockReturnValue(mockDoc);
    firestore.addDoc.mockResolvedValueOnce({ id: "mockPaymentDocID" });

    await createPayment(100, "mockUserID", "bank", "mockSlipUrl");

    expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), "users", "mockUserID");
    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "payments"),
      expect.objectContaining({
        paymentID: mockPaymentID, // Use mocked payment ID directly
        amount: 100,
        userID: mockDoc,
        date: "mockTimestamp",
        method: "bank",
        status: "Pending",
        slipUrl: "mockSlipUrl",
      })
    );
  });

  test("should throw an error when payment creation fails", async () => {
    // Simulate an error in addDoc
    firestore.addDoc.mockRejectedValueOnce(new Error("Firestore error"));

    // Expect the function to throw an error
    await expect(
      createPayment(100, "mockUserID", "bank", "mockSlipUrl")
    ).rejects.toThrow("Payment creation failed");

    // Check if error was logged
    expect(console.error).toHaveBeenCalledWith(
      "Error creating payment:",
      expect.any(Error)
    );
  });
});
