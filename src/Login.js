import React, { useEffect, useContext, useState } from 'react';
//import './Login.css'
import { signInWithGoogle } from './Firebase';
import { UserContext } from './User_provider';
import { Navigate } from 'react-router-dom'; //Navigate in lieu of Redirect
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
export default function Login() {
  const user = useContext(UserContext)
  const [redirect, setredirect] = useState(null)

  useEffect(() => {
    if (user) {
      setredirect('/dashboard')
    }
  }, [user])
  if (redirect) {
    <Navigate to={redirect}/>
  }
  return (
      <div className="login-buttons">
        <button className="login-provider-button" onClick={signInWithGoogle}>
        <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
        <span> Continue with Google</span>
       </button>
       <div>
            <h3>Email:</h3>
            <TextField 
                required 
                inputRef={null} 
                id="outlined-required" 
                label="Email" 
                onChange={()=>console.log('user')}
                defaultValue={''}
            />
            <h3>Password</h3>
            <TextField 
                required 
                inputRef={null} 
                id="outlined-required" 
                label="password" 
                onChange={()=>console.log('password')}
                defaultValue={''}
            />
            <br></br>
            <Button >Login</Button>

            
        </div>



      </div>
  );
}
