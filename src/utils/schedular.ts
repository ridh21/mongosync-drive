import * as cron from "node-cron";
import fs from "fs";
import { config } from "../config";
import logger from "./logger";
import { fetchMongoData, getCollectionStats } from "./fetchData";
import { exportData, cleanupOldExports } from "./exporter";
import { uploadToDrive, cleanupOldDriveFiles } from "./uploader";
import { sendBackupNotification, sendErrorNotification } from "./mailer";
import { formatBytes } from "./helpers";

export function startBackupSchedule() {
  if (!cron.validate(config.backupSchedule)) {
    throw new Error(`Invalid cron schedule: ${config.backupSchedule}`);
  }

  logger.info(`Starting backup schedule: ${config.backupSchedule}`);

  cron.schedule(config.backupSchedule, async () => {
    try {
      await performBackup();
    } catch (error) {
      logger.error("Backup failed:", error);
      await sendErrorNotification(error as Error);
    }
  });
}

async function performBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  logger.info("Starting backup process...");

  // Step 1: Fetch data from MongoDB
  const data = await fetchMongoData();
  const stats = await getCollectionStats();

  // Step 2: Export data to file
  const exportedFilePath = await exportData(data, timestamp);
  const exportedFileStats = await fs.promises.stat(exportedFilePath);

  // Step 3: Upload to Google Drive
  const driveLink = await uploadToDrive(exportedFilePath);

  // Step 4: Send notification
  await sendBackupNotification({
    timestamp,
    collectionName: config.collectionName,
    documentCount: stats.documentCount,
    fileSize: formatBytes(exportedFileStats.size),
    driveLink,
    format: config.exportFormat,
  });

  // Step 5: Cleanup old files
  await cleanupOldExports();
  await cleanupOldDriveFiles();

  logger.info("Backup process completed successfully");
}
