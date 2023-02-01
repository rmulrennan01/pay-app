import React, { useEffect, useContext, useState, useRef } from 'react';
//import './Login.css'
import { signInWithGoogle, signUp, signIn} from './Firebase';
import { UserContext } from './User_provider';
import { Navigate } from 'react-router-dom'; //Navigate in lieu of Redirect
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert'; 
import Typography from '@mui/material/Typography';

import GoogleIcon from '@mui/icons-material/Google';
import { fontSize } from '@mui/system';


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
      <div >
        <TextField 
          required 
          inputRef={null} 
          id="outlined-required" 
          label="Company Name" 
          onChange={()=>console.log('password')}
          defaultValue={''}
          sx={{width:300}}
      />
      <br></br><br></br>
      <TextField 
          required 
          inputRef={new_email} 
          id="outlined-required" 
          label="Your Email" 
          onChange={()=>console.log('user')}
          defaultValue={''}
          sx={{width:300}}
      />
      <br></br><br></br>

      <TextField 
          required 
          inputRef={new_password} 
          id="outlined-required" 
          label="Password" 
          type='password'
          onChange={()=>console.log('password')}
          defaultValue={''}
          sx={{width:300}}
      />
      <br></br><br></br>

      <TextField 
          required 
          inputRef={new_password_2} 
          id="outlined-required" 
          label="Re-Enter Password" 
          type='password'
          onChange={()=>console.log('password')}
          defaultValue={''}
          sx={{width:300}}
      />
      <br></br><br></br>

      <Button sx={{width:300}} variant='contained' onClick={()=>add_account()}>Create Account</Button>

      
  </div>
    )
  }



  const [error, set_error] = useState(false); 
  const login = () =>{
    try{
      signIn(email.current.value, pass.current.value)
    }
    catch(error){
      set_error(true);
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
          sx={{width:300}}
          error={error}
      />
      <br></br><br></br>
      <TextField 
          required 
          inputRef={pass} 
          id="outlined-required" 
          label="Password" 
          type='password'
          onChange={()=>console.log('password')}
          defaultValue={''}
          sx={{width:300}}
      />
      <br></br><br></br>
      <div style={{width:300}}>
        <Button sx={{width:300}} variant='contained' onClick={()=>login()}>Login</Button>
        <br></br>
        <Button sx={{position:'relative', alignItems:'center', ml:'60px'}} vairant='contained' > Forgot Password? </Button> 
        <br></br>
        <h3 style={{textAlign:'center'}}>or</h3>
        <br></br>
        {login_google()}
      </div>

  </div>
    )
  }


  const login_google = () =>{
    return(
      <Button sx={{width:300}} variant={'contained'} startIcon={<GoogleIcon/>} onClick={()=>signInWithGoogle()}> Sign In with Google </Button>
    )


  }


  return (
    <Grid container sx={{paddingTop:'50px'}} spacing={0} direction='column' alignItems='center' justifyContent='center'> 
  

      <Grid item xs={12} sx={{padding:10, textAlign:'center'}}>
        <Typography
            variant="h6"
            noWrap
            component="a"
            align='center'
            sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 800,
                letterSpacing: '.3rem',
                color: 'primary',
                textDecoration: 'none',
                fontSize:56,
                                    

            }}
            >
            Appster
      
          </Typography>
          <br></br>
          No more spreadsheets. 
          <br></br> <br></br>
          No more missed application dates.
          <br></br>  <br></br>
          Your contracts all in one place.

          


    


      </Grid>

            
      <Grid item xs={12}>
        <Paper elevation={8} sx={{width:350}}> 
          {/*}
          <button className="login-provider-button" onClick={signInWithGoogle}>
          <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
          <span> Continue with Google</span>
          </button>
    */}
          <Accordion sx={{width:350, margin:0}} expanded={panel==1} onChange={()=> panel==1 ? set_panel(2) : set_panel(1)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <h3>Already have an account?</h3>
            </AccordionSummary>
            <AccordionDetails>
              {login_account()}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{width:350}} expanded={panel==2} onChange={()=> panel==1 ? set_panel(2) : set_panel(1)}>
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
        
      </Grid>
    </Grid> 
  );
}
