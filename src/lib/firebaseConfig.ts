import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
	/* apiKey: process.env.NEXT_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID, */

  apiKey: "AIzaSyAyTR8uCFps9tsIMY9cnun3_gadQUnnZsk",
  authDomain: "flarecast-f4129.firebaseapp.com",
  projectId: "flarecast-f4129",
  storageBucket: "flarecast-f4129.firebasestorage.app",
  messagingSenderId: "1061019578637",
  appId: "1:1061019578637:web:328f4546c0c09c3cd34044",
  measurementId: "G-BL112N98FB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
