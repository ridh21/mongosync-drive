import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
import { config } from "../config";
import logger from "./logger";

export async function exportData(data: any[], timestamp: string) {
  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  const filename = `${config.collectionName}_${timestamp}`;
  const filepath = path.join(exportDir, filename);

  try {
    if (config.exportFormat === "csv") {
      return await exportToCsv(data, `${filepath}.csv`);
    } else {
      return await exportToJson(data, `${filepath}.json`);
    }
  } catch (error) {
    logger.error("Error exporting data:", error);
    throw error;
  }
}

async function exportToCsv(data: any[], filepath: string): Promise<string> {
  try {
    // Get all possible fields from the data
    const fields = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => fields.add(key));
    });

    const parser = new Parser({
      fields: Array.from(fields),
      flatten: true,
    });

    const csv = parser.parse(data);
    fs.writeFileSync(filepath, csv);
    logger.info(`Data exported to CSV: ${filepath}`);
    return filepath;
  } catch (error) {
    logger.error("Error exporting to CSV:", error);
    throw error;
  }
}

async function exportToJson(data: any[], filepath: string): Promise<string> {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    logger.info(`Data exported to JSON: ${filepath}`);
    return filepath;
  } catch (error) {
    logger.error("Error exporting to JSON:", error);
    throw error;
  }
}

export function cleanupOldExports() {
  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) return;

  const files = fs.readdirSync(exportDir);
  const now = new Date().getTime();
  const retentionPeriod = config.retentionDays * 24 * 60 * 60 * 1000;

  files.forEach((file) => {
    const filepath = path.join(exportDir, file);
    const stats = fs.statSync(filepath);
    const fileAge = now - stats.mtime.getTime();

    if (fileAge > retentionPeriod) {
      fs.unlinkSync(filepath);
      logger.info(`Deleted old export: ${file}`);
    }
  });
}
