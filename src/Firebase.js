// Import the functions you need from the SDKs you need
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

import 'firebase/compat/auth';



//import { getAuth } from "firebase/auth";





// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}


// Initialize Firebase
//const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig); 

export default firebase; 

export const auth = firebase.default.auth();


//SIGN-IN FUNCTION FOR GOOGLE ACCOUNTS
const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => {
    //TODO SETUP ACCOUNT PROFILE IN DATABSE
    console.log(res.user)
    window.location='/';
  }).catch((error) => {
    console.log(error.message)
  })
}

//SIGN UP FUNCTION FOR EMAIL/PASSWORD
export const signUp = (email, password) =>{
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(userCredential); 
    setup_account_info(user.email, user.uid)
    // ...
  })
  .catch((error) => {
      //throw("mega-error"); 
      throw error
  });
}

//SIGN IN FUNCTION FOR EMAIL/PASSWORD
export const signIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{
        const user = userCredential.user;
        console.log(user); 
        window.location='/';

    }) 
    .catch((error) => {
      console.log('error occured'); 
    });
}



const setup_account_info = (email, user_id) =>{
  // Add a new document in collection "cities"
  firebase.firestore().collection("accounts").doc(user_id).set({
    email: email,
    draws: {},
    activity: [],
    company: '', 
    address_01: '',
    address_02: '',
    City: '', 
    state: '', 
    zip: '',
    phone: '' 
  })
  .then(() => {
    console.log("Document successfully written!");
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
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

//PASSWORD RESET VIA EMAIL
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};