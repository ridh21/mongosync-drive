import dotenv from "dotenv";
import { exit } from "process";

dotenv.config();

interface Config {
  // MongoDB Configuration
  mongoUri: string;
  dbName: string;
  collectionName: string;

  // Google Drive Configuration
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleRefreshToken: string;
  driveUploadFolderId: string;

  // Email Configuration
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  emailFrom: string;
  emailTo: string[];

  // Backup Configuration
  backupSchedule: string;
  exportFormat: "csv" | "json";
  retentionDays: number;
}

function validateConfig(): Config {
  const requiredEnvVars = [
    "MONGO_URI",
    "DB_NAME",
    "COLLECTION_NAME",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "GOOGLE_REFRESH_TOKEN",
    "DRIVE_UPLOAD_FOLDER_ID",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL_FROM",
    "EMAIL_TO",
    "BACKUP_SCHEDULE",
    "EXPORT_FORMAT",
    "RETENTION_DAYS",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);
      exit(1);
    }
  }

  return {
    mongoUri: process.env.MONGO_URI!,
    dbName: process.env.DB_NAME!,
    collectionName: process.env.COLLECTION_NAME!,
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI!,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
    driveUploadFolderId: process.env.DRIVE_UPLOAD_FOLDER_ID!,
    smtpHost: process.env.SMTP_HOST!,
    smtpPort: parseInt(process.env.SMTP_PORT!),
    smtpUser: process.env.SMTP_USER!,
    smtpPass: process.env.SMTP_PASS!,
    emailFrom: process.env.EMAIL_FROM!,
    emailTo: process.env.EMAIL_TO!.split(","),
    backupSchedule: process.env.BACKUP_SCHEDULE!,
    exportFormat: process.env.EXPORT_FORMAT! as "csv" | "json",
    retentionDays: parseInt(process.env.RETENTION_DAYS!),
  };
}

export const config = validateConfig();
