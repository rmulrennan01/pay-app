// Import the functions you need from the SDKs you need

import firebase from 'firebase/compat/app';
//import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD83MLs2mOBpMt7pbddCPGUnuy8RB--GZE",
    authDomain: "pay-app-a0d4d.firebaseapp.com",
    projectId: "pay-app-a0d4d",
    storageBucket: "pay-app-a0d4d.appspot.com",
    messagingSenderId: "260360627205",
    appId: "1:260360627205:web:40720626871ce6bda7a86c",
    measurementId: "G-HW947ZJ2X4"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig); 

export default firebase; 


/*

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD83MLs2mOBpMt7pbddCPGUnuy8RB--GZE",
  authDomain: "pay-app-a0d4d.firebaseapp.com",
  projectId: "pay-app-a0d4d",
  storageBucket: "pay-app-a0d4d.appspot.com",
  messagingSenderId: "260360627205",
  appId: "1:260360627205:web:40720626871ce6bda7a86c",
  measurementId: "G-HW947ZJ2X4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

*/