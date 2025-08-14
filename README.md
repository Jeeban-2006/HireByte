# <p align="center">🚀 HireByte</p>

<p align="center">  <img src="https://img.shields.io/github/issues/Jeeban-2006/HireByte?style=flat-square" alt="issues" /> <img src="https://img.shields.io/github/stars/Jeeban-2006/HireByte?style=flat-square" alt="stars" /> <img src="https://img.shields.io/github/last-commit/Jeeban-2006/HireByte?style=flat-square" alt="last-commit" /> </p> <p align="center"> <b>A Modern & ATS-Friendly Resume Building Platform built with Next.js and Firebase</b><br> <i>Simplifying the hiring process for recruiters and candidates with a stunning UI and robust features.</i> </p>

# ✨ Overview

HireByte is a high-performance, scalable resume building platform developed with Next.js 14, TypeScript and Firebase.
It streamlines recruitment for teams and job seekers, offering authentication and real-time resume score. Out-of-the-box, it comes with production-ready architecture, easy deployment, and beautiful responsive design.

<!-- 📸 Screenshots
Landing Page	Job Listings	Candidate Dashboard
Tip: Add your own screenshots in the assets/screenshots directory for greater impact! -->

# 🛠 Features
🚀 Next.js 14 — Latest app routing, SSR for SEO & performance

🔥 Firebase Integration — Authentication, Firestore (real-time DB), easy deployment

🎨 Tailwind CSS — Utility-first, fully responsive design

🔐 Secure Auth — Email/password with Firebase Auth

🗃️ Firestore Database — Store/manage jobs & applications

🌐 Responsive UI — Perfect look on desktop, tablet, and mobile

🛠 TypeScript — Safer, scalable codebase

📄 Easily Customizable — Modular structure for extensibility

# 📂 Directory Structure

```
│── src/
│   ├── app/                  # Next.js app directory
│   │    ├── page.tsx         # Homepage
│   │    ├── layout.tsx       # Layout component for app
│   ├── components/           # UI components (Buttons, Cards, etc.)
│   ├── lib/                  # firebase.ts (Firebase config/helpers)
│── public/                   # Static assets
│── README.md
│── package.json
```

# 🚀 Getting Started
1️⃣ Prerequisites

- Node.js ≥ 18
- npm or yarn
- Firebase Project with Firestore & Auth enabled

2️⃣ Installation
```
bash
git clone https://github.com/Jeeban-2006/HireByte.git
cd HireByte
npm install
```
3️⃣ Firebase Setup

- Go to Firebase Console
- Create a new project
- Enable Email/Password authentication under Auth → Sign-in Method
- Create a Cloud Firestore database in test or production mode
- Copy your Firebase config and setup src/lib/firebase.ts like this:

```
ts
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
4️⃣ Start the App
```
bash
npm run dev
Browse to http://localhost:3000 to see the app in action!
```

# 📦 Deployment
One-command deploy to either:

→ Vercel
```
bash
npm install -g vercel
vercel
```
→ Firebase Hosting
```
bash
firebase init hosting
firebase deploy
```

# 🛠 Tech Stack
- Layer	Technology
- Frontend	Next.js 14, TypeScript, Tailwind CSS
- Backend	Firebase (Auth, Firestore)
- Hosting	Vercel / Firebase Hosting
  
# 🤝 Contributing
Contributions are welcome! To contribute:

- Fork this repo
- Create a new branch:
```
bash
git checkout -b feature-name
``` 
- Commit your changes:
```
bash
git commit -m "Add some feature"
```
- Push to your branch:
```
bash
git push origin feature-name
```
- Open a Pull Request!

# 📜 License
Licensed under the MIT License — use, modify, distribute!

# 🙌 Acknowledgements
- Next.js
- Firebase
- Tailwind CSS

# ⭐️ Show Your Support
If you find this project useful, please ⭐️ star the repo and share it!

<p align="center"> <b>Made with ❤️ by Jeeban</b> </p>