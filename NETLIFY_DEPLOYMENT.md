# Netlify Deployment Guide for HireByte

## Environment Variables Setup

### Step 1: Set Environment Variables on Netlify

Go to your Netlify site dashboard → Site settings → Environment variables and add:

```bash
# Google AI API Key
GOOGLE_GENAI_API_KEY=AIzaSyB9nBIoFuUVkyZLu2cHX4fhzzpop31T458

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAlAZkuGIE5v9JDug8eFP3fl1YiBVjQaZU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ats-resume-ace-tzfj1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ats-resume-ace-tzfj1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ats-resume-ace-tzfj1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=33396919018
NEXT_PUBLIC_FIREBASE_APP_ID=1:33396919018:web:bd89915148d450aa5ca593
```

### Step 2: Configure Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ats-resume-ace-tzfj1`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add your Netlify domains:
   - `your-site-name.netlify.app`
   - `your-custom-domain.com` (if you have one)
   - Keep `localhost` for development

### Step 3: Deploy

1. **Connect Repository**: Connect your GitHub repo to Netlify
2. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Deploy**: Trigger deployment

## Troubleshooting

### Authentication Not Working
- Check browser console for error messages
- Verify all environment variables are set on Netlify
- Ensure Firebase domains include your Netlify URL

### Build Failing
- Check Netlify build logs for specific errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### API Key Issues
- Double-check API keys are correctly copied
- Ensure no extra spaces or quotes in environment variables
- Verify Google AI API key has proper permissions

## Testing

After deployment:
1. Visit your Netlify URL
2. Open browser developer tools → Console
3. Look for Firebase initialization messages
4. Test authentication features

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console for Firebase errors
3. Verify Firebase project configuration
4. Ensure all environment variables are set correctly
