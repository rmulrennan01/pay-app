import React, { useEffect, useContext, useState, useRef } from 'react';
//import './Login.css'
import { signInWithGoogle, signUp, signIn} from './Firebase';
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


  const new_email = useRef(); 
  const new_password = useRef(); 
  const new_password_2 = useRef();

  const add_account = () =>{
    try{
      signUp(new_email.current.value, new_password.current.value)
    } catch (e){
      console.log('failure'); 
    }
  }

  //CREAT ACCOUNT FORM
  const create_account = () => {
    return(
      <div>
      <h3>Enter your email:</h3>
      <TextField 
          required 
          inputRef={new_email} 
          id="outlined-required" 
          label="Email" 
          onChange={()=>console.log('user')}
          defaultValue={''}
      />
      <h3>Enter your password:</h3>
      <TextField 
          required 
          inputRef={new_password} 
          id="outlined-required" 
          label="password" 
          type='password'
          onChange={()=>console.log('password')}
          defaultValue={''}
      />
      <h3>Enter your password again:</h3>
      <TextField 
          required 
          inputRef={new_password_2} 
          id="outlined-required" 
          label="password" 
          type='password'
          onChange={()=>console.log('password')}
          defaultValue={''}
      />
      <br></br>
      <Button onClick={()=>add_account()}>Create Account</Button>

      
  </div>
    )
  }

  const email = useRef(); 
  const pass = useRef();
  //LOGIN FORM
  const login_account = () => {
    return(
      <div>
      <h3>Enter your email:</h3>
      <TextField 
          required 
          inputRef={email} 
          id="outlined-required" 
          label="Email" 
          onChange={()=>console.log('user')}
          defaultValue={''}
      />
      <h3>Enter your password:</h3>
      <TextField 
          required 
          inputRef={pass} 
          id="outlined-required" 
          label="password" 
          type='password'
          onChange={()=>console.log('password')}
          defaultValue={''}
      />
      <Button onClick={()=>signIn(email.current.value, pass.current.value)}>Login</Button>



      
  </div>
    )
  }


  return (
      <div className="login-buttons">
        {/*}
        <button className="login-provider-button" onClick={signInWithGoogle}>
        <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
        <span> Continue with Google</span>
        </button>
  */}
        {login_account()}

        {create_account()}

      </div>
  );
}
