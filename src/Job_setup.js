import React, {useState} from 'react';
import Schedule_of_Values from './Job_setup/Schedule_of_Values.js'; 
import Owner_Info from './Job_setup/Owner_Info.js'; 
import Project_Info from './Job_setup/Project_Info.js'; 
import Billing_Details from './Job_setup/Billing_Details.js'; 

//Stepper
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
    const [project_info, set_project_info] = useState({
        owner_name: "", 
        owner_address_01: "", 
        owner_address_02: "",
        owner_city:"",
        owner_state:"",
        owner_zip:"",
        project_name:"",
        project_address_01:"",
        project_address_02:"",
        project_city:"",
        project_state:"",
        project_zip:"",
        contract_number:"",
        contract_date: ""
    }

    ); 
    
    const update_sov = (replacement) => {
        set_sov_data(replacement); 

    }

    


     
    const steps = [
        {lable: 'Owner Information', content: <Owner_Info/>},
        {lable: 'Project Info', content: <Project_Info/>},
        {lable: 'Schedule of Values', content: <Schedule_of_Values sov_data={sov_data} update_sov={update_sov}/>},
        {lable: 'Billing Details', content: <Billing_Details/>}
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
