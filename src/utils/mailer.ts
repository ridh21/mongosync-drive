import nodemailer from "nodemailer";
import { config } from "../config";
import logger from "./logger";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

interface BackupResult {
  timestamp: string;
  collectionName: string;
  documentCount: number;
  fileSize: string;
  driveLink: string;
  format: string;
}

export async function sendBackupNotification(result: BackupResult) {
  const subject = `MongoDB Backup Complete - ${result.collectionName}`;
  const html = `
        <h2>MongoDB Backup Completed Successfully</h2>
        <p>Here are the details of the backup:</p>
        <ul>
            <li><strong>Collection:</strong> ${result.collectionName}</li>
            <li><strong>Timestamp:</strong> ${result.timestamp}</li>
            <li><strong>Documents Backed Up:</strong> ${
              result.documentCount
            }</li>
            <li><strong>Backup File Size:</strong> ${result.fileSize}</li>
            <li><strong>Format:</strong> ${result.format.toUpperCase()}</li>
        </ul>
        <p>The backup has been uploaded to Google Drive. You can access it here:</p>
        <p><a href="${result.driveLink}">${result.driveLink}</a></p>
        <p>This is an automated message. Please do not reply.</p>
    `;

  try {
    await transporter.sendMail({
      from: config.emailFrom,
      to: config.emailTo,
      subject,
      html,
    });
    logger.info("Backup notification email sent successfully");
  } catch (error) {
    logger.error("Error sending backup notification email:", error);
    throw error;
  }
}

export async function sendErrorNotification(error: Error) {
  const subject = "MongoDB Backup Error";
  const html = `
        <h2>MongoDB Backup Error</h2>
        <p>An error occurred during the backup process:</p>
        <pre style="background-color: #f8f8f8; padding: 15px; border-radius: 5px;">
${error.stack || error.message}
        </pre>
        <p>Please check the logs for more details.</p>
        <p>This is an automated message. Please do not reply.</p>
    `;

  try {
    await transporter.sendMail({
      from: config.emailFrom,
      to: config.emailTo,
      subject,
      html,
    });
    logger.info("Error notification email sent successfully");
  } catch (emailError) {
    logger.error("Error sending error notification email:", emailError);
    // Don't throw here to avoid cascading errors
  }
}
