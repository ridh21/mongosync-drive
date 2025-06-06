import { MongoClient } from "mongodb";
import fs from "fs";
import { Parser } from "json2csv";

interface ExportOptions {
  mongoUri: string;
  dbName: string;
  collectionName: string;
  outputFormat: "json" | "csv";
  outputPath: string;
}

export async function exportCollection(options: ExportOptions): Promise<void> {
  const client = new MongoClient(options.mongoUri);

  try {
    await client.connect();
    const db = client.db(options.dbName);
    const collection = db.collection(options.collectionName);

    const data = await collection.find({}).toArray();

    if (options.outputFormat === "json") {
      await fs.promises.writeFile(
        options.outputPath,
        JSON.stringify(data, null, 2)
      );
    } else if (options.outputFormat === "csv") {
      const parser = new Parser();
      const csv = parser.parse(data);
      await fs.promises.writeFile(options.outputPath, csv);
    }

    return;
  } finally {
    await client.close();
  }
}
