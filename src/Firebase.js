// Import the functions you need from the SDKs you need
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';



//import { getAuth } from "firebase/auth";





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


//SIGN-IN FUNCTION
export const auth = firebase.default.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => {
    console.log(res.user)
  }).catch((error) => {
    console.log(error.message)
  })
}

//LOG-OUT FUNCTION
export const logOut = () => {
  auth.signOut().then(()=> {
    console.log('logged out')
  }).catch((error) => {
    console.log(error.message)
  })
}


