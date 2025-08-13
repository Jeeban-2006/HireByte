# Environment Setup

This project uses environment variables to secure sensitive configuration like Firebase API keys.

## Setup Instructions

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual Firebase configuration values in `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID (optional)

## Security Notes

- The `.env.local` file is already included in `.gitignore` and will not be committed to version control
- Environment variables prefixed with `NEXT_PUBLIC_` are available in the browser
- Never commit your actual environment variables to the repository
- Keep your `.env.local` file secure and do not share it publicly

## Firebase Configuration

The Firebase configuration is now secure and reads from environment variables. The configuration is located in `src/lib/firebase.ts`.
