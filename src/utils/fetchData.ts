import { MongoClient } from "mongodb";
import { config } from "../config";
import logger from "./logger";

export async function fetchMongoData() {
  const client = new MongoClient(config.mongoUri);

  try {
    await client.connect();
    logger.info("Connected to MongoDB");

    const db = client.db(config.dbName);
    const collection = db.collection(config.collectionName);

    const data = await collection.find({}).toArray();
    logger.info(
      `Retrieved ${data.length} documents from ${config.collectionName}`
    );

    return data;
  } catch (error) {
    logger.error("Error fetching data from MongoDB:", error);
    throw error;
  } finally {
    await client.close();
    logger.info("Closed MongoDB connection");
  }
}

export async function getCollectionStats() {
  const client = new MongoClient(config.mongoUri);

  try {
    await client.connect();
    const db = client.db(config.dbName);
    const collection = db.collection(config.collectionName);

    const stats = await collection.stats();
    return {
      documentCount: stats.count,
      size: stats.size,
      avgDocumentSize: stats.avgObjSize,
    };
  } catch (error) {
    logger.error("Error fetching collection stats:", error);
    throw error;
  } finally {
    await client.close();
  }
}
