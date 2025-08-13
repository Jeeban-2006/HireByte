
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "ats-resume-ace-tzfj1",
  "appId": "1:33396919018:web:bd89915148d450aa5ca593",
  "storageBucket": "ats-resume-ace-tzfj1.firebasestorage.app",
  "apiKey": "AIzaSyAlAZkuGIE5v9JDug8eFP3fl1YiBVjQaZU",
  "authDomain": "ats-resume-ace-tzfj1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "33396919018"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

export { app, auth };
