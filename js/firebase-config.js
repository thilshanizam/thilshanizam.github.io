import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHTzmjJ4XZLq6L2DgWb2w9-aKZhs03wBU",
  authDomain: "political-life-game.firebaseapp.com",
  projectId: "political-life-game",
  storageBucket: "political-life-game.firebasestorage.app",
  messagingSenderId: "208451702811",
  appId: "1:208451702811:web:a3ec28998a12e7837828be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

const db = getFirestore(app);

// Make authentication available to other JS files
export { app, auth, db };
