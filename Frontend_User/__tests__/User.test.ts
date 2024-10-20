import { signInUser, createUser } from "../Controller/UserController";
import * as firestore from "firebase/firestore";

// Mock Firebase Firestore methods
jest.mock("firebase/firestore", () => {
  return {
    initializeApp: jest.fn(),
    getFirestore: jest.fn().mockReturnValue({}), // Mock the getFirestore function
    collection: jest.fn(), // Mock the collection function
    query: jest.fn(), // Mock the query function
    where: jest.fn(), // Mock the where function
    getDocs: jest.fn(), // Mock the getDocs function
    addDoc: jest.fn(),
  };
});

describe("UserController", () => {
  const mockUserRef = {};
  const mockUserID = "user123";
  const email = "test@example.com";
  const password = "password123";

  const userData = {
    username: "John Doe",
    email: "johndoe@example.com",
    phone: "1234567890",
    address: "123 Main St",
    password: "securePassword123",
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("createUser should add a user to Firestore", async () => {
    (firestore.addDoc as jest.Mock).mockResolvedValueOnce({});

    await createUser(userData);

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users"
    );
    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "users"),
      userData
    );
  });

  test("createUser should throw an error when Firestore fails", async () => {
    (firestore.addDoc as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(createUser(userData)).rejects.toThrow("User creation failed");

    expect(firestore.collection).toHaveBeenCalledWith(
      expect.anything(),
      "users"
    );
    expect(firestore.addDoc).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "users"),
      userData
    );
  });

  test("signInUser should return success for valid email and password", async () => {
    const mockDocs = [
      {
        id: mockUserID,
        data: () => ({
          email: email,
          password: password, // Valid password
          name: "Test User",
        }),
      },
    ];

    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: mockDocs,
    });

    const result = await signInUser(email, password);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Sign in successful");
    expect(result.user).toEqual({
      id: mockUserID,
      email: email,
      password: password,
      name: "Test User",
    });
    expect(firestore.query).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "users"),
      firestore.where("email", "==", email)
    );
    expect(firestore.getDocs).toHaveBeenCalled();
  });

  test("signInUser should return error when no user is found", async () => {
    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: true,
    });

    const result = await signInUser(email, password);

    expect(result.success).toBe(false);
    expect(result.message).toBe("No user found with this email");
    expect(firestore.query).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "users"),
      firestore.where("email", "==", email)
    );
    expect(firestore.getDocs).toHaveBeenCalled();
  });

  test("signInUser should return error when password is incorrect", async () => {
    const mockDocs = [
      {
        id: mockUserID,
        data: () => ({
          email: email,
          password: "wrongPassword", // Different password
          name: "Test User",
        }),
      },
    ];

    (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: mockDocs,
    });

    const result = await signInUser(email, password);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Incorrect password");
    expect(firestore.query).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "users"),
      firestore.where("email", "==", email)
    );
    expect(firestore.getDocs).toHaveBeenCalled();
  });

  test("signInUser should handle errors gracefully", async () => {
    (firestore.getDocs as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const result = await signInUser(email, password);

    expect(result.success).toBe(false);
    expect(result.message).toBe("User sign-in failed");
    expect(firestore.query).toHaveBeenCalledWith(
      firestore.collection(expect.anything(), "users"),
      firestore.where("email", "==", email)
    );
    expect(firestore.getDocs).toHaveBeenCalled();
  });
});
