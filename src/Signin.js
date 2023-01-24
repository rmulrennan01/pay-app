import React from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


function Signin() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
    return (
        <div>
            
        </div>
    )
}

export default Signin
