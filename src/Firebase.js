// Import the functions you need from the SDKs you need
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

export const auth = firebase.default.auth();


//SIGN-IN FUNCTION FOR GOOGLE ACCOUNTS
const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => {
    /*firebase.collection('users').add({

    })
    */


    console.log(res.user)

    window.location='/';
    
  }).catch((error) => {
    console.log(error.message)
  })
}

//SIGN IN FUNCTION FOR EMAIL/PASSWORD


export const signUp = (email, password) =>{
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(userCredential); 
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}





//LOG-OUT FUNCTION
export const logOut = () => {
  auth.signOut().then(()=> {
    console.log('logged out')
  }).catch((error) => {
    console.log(error.message)
  })
}


