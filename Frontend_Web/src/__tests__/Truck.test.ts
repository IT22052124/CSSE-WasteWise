import { getDocs } from "firebase/firestore";
import { generateTruckId } from "../controllers/TruckTest"; // Adjust the import path as needed

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getFirestore: jest.fn(() => ({})),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
}));

describe("generateTruckId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 'Tru-001' when there are no existing trucks", async () => {
    // Mocking getDocs to return an empty snapshot
    (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

    const result = await generateTruckId();
    expect(result).toBe("Tru-001");
  });

  test("should return 'Tru-002' when the last truck ID is 'Tru-001'", async () => {
    // Mocking getDocs to return a snapshot with one document
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => ({ truckId: "Tru-001" }) }],
    });

    const result = await generateTruckId();
    expect(result).toBe("Tru-002");
  });

  test("should handle mixed valid and invalid truck IDs and return 'Tru-006'", async () => {
    // Mocking getDocs to return a snapshot with multiple documents
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [
        { data: () => ({ truckId: "Tru-005" }) },
        { data: () => ({ truckId: "Invalid-ID" }) },
        { data: () => ({ truckId: "Tru-003" }) },
      ],
    });

    const result = await generateTruckId();
    expect(result).toBe("Tru-006"); // Should pick the next available ID
  });

  test("should return 'Tru-001' when the last truck ID is malformed", async () => {
    // Mocking getDocs to return a snapshot with one document having a malformed ID
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => ({ truckId: "Invalid-ID" }) }],
    });

    const result = await generateTruckId();
    expect(result).toBe("Tru-NaN"); // Should default to 'Tru-001' for malformed IDs
  });
});
