/**
 * Firebase Domain Configuration Helper
 * Use this to ensure your Firebase project is configured for your Netlify domain
 */

export const checkFirebaseDomainConfig = () => {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  
  console.log('Current domain:', currentDomain);
  console.log('Firebase auth domain:', authDomain);
  
  if (currentDomain.includes('netlify.app') || currentDomain.includes('netlify.com')) {
    console.warn(`
🚨 FIREBASE DOMAIN CONFIGURATION REQUIRED 🚨

Your app is running on Netlify (${currentDomain}) but your Firebase project 
might not be configured for this domain.

STEPS TO FIX:
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
3. Go to Authentication > Settings > Authorized domains
4. Add your Netlify domain: ${currentDomain}
5. Also add: ${currentDomain.replace('https://', '').replace('http://', '')}

Current authorized domains should include:
- localhost (for development)
- ${authDomain}
- ${currentDomain}
`);
  }
  
  return {
    currentDomain,
    authDomain,
    needsConfiguration: currentDomain.includes('netlify')
  };
};
