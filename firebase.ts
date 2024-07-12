// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUqadUkpcVa3tRU8aFOIAROrCVSjzbWKE",
  authDomain: "otp-nextjs-7981d.firebaseapp.com",
  projectId: "otp-nextjs-7981d",
  storageBucket: "otp-nextjs-7981d.appspot.com",
  messagingSenderId: "399106197962",
  appId: "1:399106197962:web:5ea2819a6daeecdf9ce733",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
