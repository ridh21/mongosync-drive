import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { config } from "../config";
import logger from "./logger";

const oauth2Client = new google.auth.OAuth2(
  config.googleClientId,
  config.googleClientSecret,
  config.googleRedirectUri
);

oauth2Client.setCredentials({
  refresh_token: config.googleRefreshToken,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function uploadToDrive(filepath: string): Promise<string> {
  try {
    const filename = path.basename(filepath);
    const mimeType = filepath.endsWith(".csv")
      ? "text/csv"
      : "application/json";

    const fileMetadata = {
      name: filename,
      parents: [config.driveUploadFolderId],
    };

    const media = {
      mimeType,
      body: fs.createReadStream(filepath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = response.data.id;
    const webViewLink = response.data.webViewLink;

    logger.info(`File uploaded to Google Drive: ${filename}`);
    logger.info(`Web View Link: ${webViewLink}`);

    return webViewLink || "";
  } catch (error) {
    logger.error("Error uploading to Google Drive:", error);
    throw error;
  }
}

export async function cleanupOldDriveFiles() {
  try {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - config.retentionDays);

    const response = await drive.files.list({
      q: `'${
        config.driveUploadFolderId
      }' in parents and createdTime < '${retentionDate.toISOString()}'`,
      fields: "files(id, name)",
      spaces: "drive",
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      return;
    }

    for (const file of files) {
      await drive.files.delete({
        fileId: file.id!,
      });
      logger.info(`Deleted old file from Drive: ${file.name}`);
    }
  } catch (error) {
    logger.error("Error cleaning up old Drive files:", error);
    throw error;
  }
}
