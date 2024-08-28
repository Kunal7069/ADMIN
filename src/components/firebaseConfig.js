import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAngD-e2hUy9nZwzNO-v99ox9_Zslsy-LY",
  authDomain: "adminpanel-64d85.firebaseapp.com",
  projectId: "adminpanel-64d85",
  storageBucket: "adminpanel-64d85.appspot.com",
  messagingSenderId: "300781507208",
  appId: "1:300781507208:web:5560c2ed78849aa2ec853d",
  measurementId: "G-MP2BLN738H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };