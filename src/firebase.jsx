// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhv406UMBrjbwslJ0a5Xx3nr-Svh-VtW0",
  authDomain: "flick-nest.firebaseapp.com",
  projectId: "flick-nest",
  storageBucket: "flick-nest.firebasestorage.app",
  messagingSenderId: "120606418265",
  appId: "1:120606418265:web:cb47725d29e58fe3b59848",
  measurementId: "G-4VVHNWE4Q7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export `app` for use in other files
export { app, analytics };
