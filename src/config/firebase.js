import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCxV4nDdNg1akUoptjOubwIX3DrxDrcmdo",
  authDomain: "storyspark-45fb2.firebaseapp.com",
  databaseURL: "https://storyspark-45fb2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "storyspark-45fb2",
  storageBucket: "storyspark-45fb2.firebasestorage.app",
  messagingSenderId: "900178108154",
  appId: "1:900178108154:web:1f13976152a72c6df0f343",
  measurementId: "G-YYCBERS2SG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, analytics }; 