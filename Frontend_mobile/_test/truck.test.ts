import { getTrucksForCollector, getLocationById, getLocationsByIds } from '../controller/TruckController'; // Adjust the path as necessary
import * as firestore from 'firebase/firestore'; // Import the Firestore methods

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => {
  return {
    initializeApp: jest.fn(),
    getFirestore: jest.fn().mockReturnValue({}), // Mock the getFirestore function
    collection: jest.fn(), // Mock the collection function
    getDocs: jest.fn(), // Mock the getDocs function
    doc: jest.fn(), // Mock the doc function
    getDoc: jest.fn(), // Mock the getDoc function
  };
});

describe('TruckController', () => {
  const mockCollectorId = 'collector_1';
  const mockLocationId = 'loc_1';
  const mockLocationData = { name: 'Location 1', coordinates: [10, 20] };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('getTrucksForCollector', () => {
    test('should return assigned trucks for the collector', async () => {
      const mockTruckDocs = [
        {
          id: 'truck_1',
          data: () => ({
            name: 'Truck 1',
            employees: [mockCollectorId, 'collector_2'],
          }),
        },
        {
          id: 'truck_2',
          data: () => ({
            name: 'Truck 2',
            employees: ['collector_3', 'collector_4'],
          }),
        },
      ];

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockTruckDocs,
      });

      const trucks = await getTrucksForCollector(mockCollectorId);

      expect(trucks).toEqual([
        { id: 'truck_1', name: 'Truck 1', employees: [mockCollectorId, 'collector_2'] },
      ]);
      expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), 'trucks');
      expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
    });

    test('should return an empty array if no trucks are assigned', async () => {
      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [],
      });

      const trucks = await getTrucksForCollector(mockCollectorId);

      expect(trucks).toEqual([]);
      expect(firestore.getDocs).toHaveBeenCalled(); // Ensure getDocs was called
    });
  });

  
});
