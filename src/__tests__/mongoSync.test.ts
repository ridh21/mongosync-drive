import { MongoClient } from "mongodb";
import { exportCollection } from "../mongoSync";

jest.mock("mongodb");

describe("MongoDB Sync Tests", () => {
  let mockMongoClient: jest.Mocked<MongoClient>;

  beforeEach(() => {
    mockMongoClient = {
      connect: jest.fn(),
      close: jest.fn(),
      db: jest.fn(),
    } as unknown as jest.Mocked<MongoClient>;

    (MongoClient as jest.MockedClass<typeof MongoClient>).mockImplementation(
      () => mockMongoClient
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to MongoDB and export collection", async () => {
    const mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { _id: "1", name: "Test1" },
          { _id: "2", name: "Test2" },
        ]),
      }),
    };

    mockMongoClient.db.mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    } as any);

    const result = await exportCollection({
      mongoUri: "mongodb://localhost:27017",
      dbName: "testDb",
      collectionName: "testCollection",
      outputFormat: "json",
      outputPath: "/tmp/test.json",
    });

    expect(mockMongoClient.connect).toHaveBeenCalled();
    expect(mockMongoClient.db).toHaveBeenCalledWith("testDb");
    expect(result).toBeDefined();
  });

  // Add more test cases for error handling, different output formats, etc.
});
