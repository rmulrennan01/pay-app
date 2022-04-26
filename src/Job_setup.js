import React, {useState} from 'react';
import Schedule_of_Values from './Schedule_of_Values.js'; 

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

//Forms
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';






function Job_setup() {
    const [current_step, set_current_step] = useState(0); 
    const [sov_data, set_sov_data] = useState([]); 
    
    
    const update_sov = (replacement) => {
        set_sov_data(replacement); 

    }

    


     
    const steps = [
        {lable: 'Owner Information', content: <></>},
        {lable: 'Project Info', content: <></>},
        {lable: 'Project Location', content: <></>},
        {lable: 'Schedule of Values', content: <Schedule_of_Values sov_data={sov_data} update_sov={update_sov}/>},
        {lable: 'Billing Details', content: <></>}
    ];




    const owner_form = () => {
        return(
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                <Input
                id="standard-adornment-amount"
             
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
          </FormControl>

        )

    }


    const build_steps = (item,index) => {
        return(
            
            <Step key={index}> 
                <StepLabel onClick={()=>set_current_step(index)}> 
                    {item.lable}
                </StepLabel>

                <StepContent> 
 
                    <div> 
                        {item.content}
                    </div>
                    <div>
                        <Button onClick={()=>set_current_step(current_step+1)}> 
                            Continue
                        </Button> 
                        <Button onClick={()=>set_current_step(0)}> 
                            Back
                        </Button> 

                    </div>
                </StepContent>

            </Step>


        ); 

    }

    return (
        <Paper>
            <h1> Setup a new contract</h1>
            <Stepper activeStep={current_step} orientation="vertical">
                {steps.map(build_steps)}
                

            </Stepper>
            
        </Paper>
    )
}

export default Job_setup
