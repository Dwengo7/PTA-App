// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "pta-app-917f5.firebaseapp.com",
  projectId: "pta-app-917f5",
  storageBucket: "pta-app-917f5.firebasestorage.app",
  messagingSenderId: "335430137054",
  appId: "1:335430137054:web:7a9fb10266a59e1ca63e4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };