# API Setup Guide

## Getting Your Google AI API Key

To fix the ATS scoring error, you need to get a Google AI API key and configure it properly.

### Step 1: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Choose your project or create a new one
5. Copy the generated API key

### Step 2: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace `your_google_ai_api_key_here` with your actual API key:
   ```
   GOOGLE_GENAI_API_KEY=your_actual_api_key_here
   ```

### Step 3: Restart Your Development Server

After updating the environment variables, restart your development server:

```bash
npm run dev
```

## Security Best Practices

✅ **DO:**
- Keep your API keys in `.env.local` (already in .gitignore)
- Use environment variables for all sensitive configuration
- Never commit API keys to version control
- Regularly rotate your API keys

❌ **DON'T:**
- Put API keys directly in your code
- Share API keys in chat, email, or documentation
- Use the same API key across multiple projects
- Commit `.env.local` to git

## Troubleshooting

If you're still getting errors after setting up the API key:

1. **Check API Key Format**: Make sure there are no extra spaces or quotes
2. **Verify Permissions**: Ensure your API key has access to Gemini models
3. **Check Quota**: Verify you haven't exceeded your API usage limits
4. **Restart Server**: Always restart the development server after changing environment variables

## API Usage Monitoring

Monitor your API usage at [Google Cloud Console](https://console.cloud.google.com/apis/dashboard) to avoid unexpected charges and quota issues.
