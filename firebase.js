import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzTL43Q8dXqNVudsCWeS2dZNTEO9OL1ng",
  authDomain: "pwaproject-6da4c.firebaseapp.com",
  projectId: "pwaproject-6da4c",
  storageBucket: "pwaproject-6da4c.appspot.com",
  messagingSenderId: "299642393614",
  appId: "1:299642393614:web:f8a7c61b74a90623de985f",
  measurementId: "G-FGZ9CCRWGV",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
