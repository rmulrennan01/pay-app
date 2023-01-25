import React, { useEffect, useContext, useState, useRef } from 'react';
//import './Login.css'
import { signInWithGoogle, signUp, signIn} from './Firebase';
import { UserContext } from './User_provider';
import { Navigate } from 'react-router-dom'; //Navigate in lieu of Redirect
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert'; 

import GoogleIcon from '@mui/icons-material/Google';


export default function Login() {
  const user = useContext(UserContext)
  const [redirect, setredirect] = useState(null);
  const [new_user, set_new_user] = useState(false); 
  const [panel, set_panel] = useState(1); 
  const [login_fail, set_login_fail] = useState(false); 

/*
  useEffect(() => {
    if (user) {
      setredirect('/dashboard')
    }
  }, [user])
  if (redirect) {
    <Navigate to={redirect}/>
  }
*/

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
      <br></br><br></br>
      <Button sx={{width:200}} variant='contained' onClick={()=>add_account()}>Create Account</Button>

      
  </div>
    )
  }


  const login_2 = () =>{
    
    signIn(email.current.value, pass.current.value)
    .then(() =>{
      console.log('login success'); 

  })
  
  .catch((error) => {
    //throw("mega-error"); 
    console.log(error); 
    console.log('login fia')
    set_login_fail(true); 
   
  })
  }

  const login = () =>{
    try{
      signIn(email.current.value, pass.current.value)
    }
    catch(error){
      console.log('issues')
    }
  }







  const email = useRef(); 
  const pass = useRef();
  //LOGIN FORM
  const login_account = () => {
    return(
      <div>
      
      <TextField 
          required 
          inputRef={email} 
          id="outlined-required" 
          label="Email" 
          onChange={()=>console.log('user')}
          defaultValue={''}
      />
      <br></br><br></br>
      <TextField 
          required 
          inputRef={pass} 
          id="outlined-required" 
          label="password" 
          type='password'
          onChange={()=>console.log('password')}
          defaultValue={''}
      />
      {login_fail ? <Alert variant="outlined" severity="error"> This is an error alert — check it out! </Alert> : <></>}
      <br></br><br></br>
      <Button sx={{width:200}} variant='contained' onClick={()=>login()}>Login</Button>
      <br></br>
      <Button vairant='contained'> Forgot Password? </Button> 
      <br></br>
        <h3>or</h3>
      <br></br>
      {login_google()}

  </div>
    )
  }


  const login_google = () =>{
    return(
      <Button variant={'contained'} startIcon={<GoogleIcon/>} onClick={()=>signInWithGoogle()}> Sign In with Google </Button>
    )


  }


  return (
      <Paper elevation={8} sx={{width:400, margin:'10%'}}> 
        {/*}
        <button className="login-provider-button" onClick={signInWithGoogle}>
        <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
        <span> Continue with Google</span>
        </button>
  */}
        <Accordion sx={{width:400, margin:0}} expanded={panel==1} onChange={()=> panel==1 ? set_panel(2) : set_panel(1)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <h3>Already have an account?</h3>
          </AccordionSummary>
          <AccordionDetails>
            {login_account()}
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{width:400}} expanded={panel==2} onChange={()=> panel==1 ? set_panel(2) : set_panel(1)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <h3>Need an account?</h3>
          </AccordionSummary>
          <AccordionDetails>
            {create_account()}
          </AccordionDetails>
        </Accordion>

      </Paper>
  );
}
