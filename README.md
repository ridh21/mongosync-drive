# mongosync-drive

A MongoDB Library plugin to take timely backups and sync with Google Drive on a cron schedule.
`this library will be availble soon on npm!`

## Features

- Export MongoDB collections to CSV or JSON format
- Automatic upload to Google Drive
- Scheduled backups using cron
- Email notifications for backup status
- Retention policy for old backups
- CLI interface for easy management

## Installation

```bash
npm install mongosync-drive
```

## Configuration

1. Create a `.env` file in your project root (use `.env.example` as a template)
2. Configure the following environment variables:

### MongoDB Configuration

- `MONGO_URI`: MongoDB connection string
- `DB_NAME`: Database name
- `COLLECTION_NAME`: Collection to backup

### Google Drive Configuration

1. Create a Google Cloud Project
2. Enable Google Drive API
3. Create OAuth 2.0 credentials
4. Configure the following:
   - `GOOGLE_CLIENT_ID`: OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: OAuth client secret
   - `GOOGLE_REDIRECT_URI`: OAuth redirect URI
   - `GOOGLE_REFRESH_TOKEN`: OAuth refresh token
   - `DRIVE_UPLOAD_FOLDER_ID`: Google Drive folder ID for uploads

### Email Configuration

- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `EMAIL_FROM`: Sender email address
- `EMAIL_TO`: Comma-separated list of recipient email addresses

### Backup Configuration

- `BACKUP_SCHEDULE`: Cron schedule (default: "0 0 \* \* \*" - daily at midnight)
- `EXPORT_FORMAT`: Export format ("csv" or "json")
- `RETENTION_DAYS`: Number of days to keep backups

## Usage

### CLI Commands

Start the backup scheduler:

```bash
npx mongosync-drive start
```

Validate configuration:

```bash
npx mongosync-drive validate
```

### Programmatic Usage

```typescript
import { startBackupSchedule } from "mongosync-drive";

// Start the backup scheduler
startBackupSchedule();
```

## Logs

Logs are written to:

- `error.log`: Error messages only
- `combined.log`: All log messages
- Console: Colored output for development

## License

MIT
