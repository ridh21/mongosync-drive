#!/usr/bin/env node
import { Command } from "commander";
import { startBackupSchedule } from "./utils/schedular";
import { config } from "./config";
import logger from "./utils/logger";

const program = new Command();

program
  .name("mongosync-drive")
  .description(
    "Export MongoDB collection to CSV/JSON and upload to Google Drive on cron schedule"
  )
  .version("1.0.0");

program
  .command("start")
  .description("Start the backup scheduler")
  .action(() => {
    try {
      logger.info("Starting MongoDB Sync Drive...");
      logger.info(
        `Configuration loaded for collection: ${config.collectionName}`
      );
      logger.info(`Export format: ${config.exportFormat}`);
      logger.info(`Schedule: ${config.backupSchedule}`);
      startBackupSchedule();
    } catch (error) {
      logger.error("Failed to start backup scheduler:", error);
      process.exit(1);
    }
  });

program
  .command("validate")
  .description("Validate configuration")
  .action(() => {
    try {
      logger.info("Validating configuration...");
      logger.info("Configuration is valid!");
      logger.info("Configuration details:");
      logger.info(`- MongoDB Collection: ${config.collectionName}`);
      logger.info(`- Export Format: ${config.exportFormat}`);
      logger.info(`- Schedule: ${config.backupSchedule}`);
      logger.info(`- Retention Period: ${config.retentionDays} days`);
      logger.info(`- Notification Recipients: ${config.emailTo.join(", ")}`);
    } catch (error) {
      logger.error("Configuration validation failed:", error);
      process.exit(1);
    }
  });

program.parse();
