// src/__tests__/createBinType.test.ts

import { createBinType } from '../controllers/BinTypeController'; // Adjust the path according to your project structure

describe('createBinType', () => {
  let consoleErrorSpy: jest.SpyInstance;

  // This runs before all the tests
  beforeAll(() => {
    // Mock console.error to prevent it from actually printing to the console
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // This runs after all the tests to restore the original function
  afterAll(() => {
    consoleErrorSpy.mockRestore(); // Restore the original console.error function
  });

  it('should create a bin type successfully', async () => {
    // Mock data for successful creation
    const binTypeData = {
      name: 'Mock Bin Type',
      description: 'This is a mock bin type.',
    };

    // Call the createBinType function with valid data
    const result = await createBinType(binTypeData);

    // Check that the result is as expected (e.g., a bin type ID is returned)
    expect(result).toBeDefined();
    expect(result).toMatch(/mockBinTypeID/); // Adjust based on actual return value
  });

  it('should throw an error when bin type creation fails', async () => {
    // Simulate an error by passing invalid data or mocking Firestore to throw an error
    const binTypeData = {
      // Provide invalid data here that triggers an error
      name: '', // or other invalid field
      description: '',
    };

    // We expect the function to throw an error, so we wrap it in a try-catch block
    await expect(createBinType(binTypeData)).rejects.toThrow("Failed to create bin type");

    // Now we check if console.error was called
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error creating bin type:",
      expect.any(Error) // This expects any error object
    );
  });
});
