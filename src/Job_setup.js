import React, {useEffect, useState} from 'react';
import Schedule_of_Values from './Job_setup/Schedule_of_Values.js'; 
import Owner_Info from './Job_setup/Owner_Info.js'; 
import Project_Info from './Job_setup/Project_Info.js'; 
import Billing_Details from './Job_setup/Billing_Details.js'; 
import Confirmation_Modal from './Job_setup/Confirmation_Modal.js'; 

import Modal from '@mui/material/Modal';

import firebase from "./Firebase.js"; 


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




function Job_setup() {
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [list,setList] = useState([]); 
    const [loading, setLoading] = useState([]); 

    const [current_step, set_current_step] = useState(0); 
    const [sov_data, set_sov_data] = useState([]); 
    const [modal_open, set_modal_open] = useState(false); 

    const [owner_info, set_owner_info] = useState({
        name: "", 
        address_01: "", 
        address_02: "",
        city:"",
        state:"",
        zip:"",
    }
    ); 

    const [project_info, set_project_info] = useState({
        name: "", 
        address_01: "", 
        address_02: "",
        city:"",
        state:"",
        zip:"",
        number:"", 
        date:"" 
    }
    ); 

    const [billing_info, set_billing_info] = useState({retention: 5, due_date: "20th"});
    
    const update_sov = (replacement) => {
        set_sov_data(replacement); 
    }

    const update_project_info = (replacement) => {
        set_project_info(replacement); 
    }

    const update_owner_info = (replacement) => {
        set_owner_info(replacement); 
    }

    const update_billing_info = (replacement) => {
        set_billing_info(replacement); 
    }

    


     
    const steps = [
        {label: 'Owner Information', content: <Owner_Info owner_info={owner_info} update_owner_info={update_owner_info}/> },
        {label: 'Project Info', content: <Project_Info project_info={project_info} update_project_info={update_project_info} />},
        {label: 'Schedule of Values', content: <Schedule_of_Values sov_data={sov_data} update_sov={update_sov}/>},
        {label: 'Billing Details', content: <Billing_Details billing_info={billing_info} update_billing_info={update_billing_info}/>}
    ];



    
    React.useEffect( () => {
        const fetchData = async () =>{
        const dataList = await firestoreDB.collection("contracts").get(); //updated
        setList(dataList.docs.map(doc=>doc.data())); 
        setLoading(false); 
        }
        fetchData(); 
    }, []);


    /*
    const add_owner = () =>{
        firestoreDB.collection("owners").add({
            name: owner_info.name,
            address_01: owner_info.address_01,
            address_02: owner_info.address_02,
            city:owner_info.city,
            state: owner_info.state,
            zip: owner_info.zip


        })
        .then((docRef) => {
            alert("Data Successfully Submitted");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
    */

   const submit_db = () =>{
    let temp_project = project_info;
    temp_project["sov"] = sov_data; 
    //console.log(temp_project); 

    
    
    firestoreDB.collection("owners").add(owner_info)
    .then((docRef) => {
        console.log("Owner Submission Successful");
        firestoreDB.collection("contracts").add(temp_project)
        .then((docRef) => {
            console.log("Project Submission Successful");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

}

    


    

    


    const build_steps = (item,index) => {
        const button_builder = () => {
            if (index==0){
                return(
                    <Button onClick={()=>set_current_step(current_step+1)}> 
                        Continue
                    </Button> 

                );
            }
            else if (index==steps.length-1){
                return(
                    <>
                    <Button onClick={()=>set_modal_open(true)}> 
                        Submit
                    </Button> 
                    <Button onClick={()=>set_current_step(current_step-1)}> 
                        Back
                    </Button> 
                    </>
                );
            }
            else{
                return(
                    <>
                    <Button onClick={()=>set_current_step(current_step+1)}> 
                        Continue
                    </Button> 
                    <Button onClick={()=>set_current_step(current_step-1)}> 
                        Back
                    </Button> 
                    </>

                )
            }

        };

        return(
            
            <Step key={index}> 
                <StepLabel onClick={()=>set_current_step(index)}> 
                    {item.label}
                </StepLabel>

                <StepContent> 
 
                    <div> 
                        {item.content}
                    </div>
                    <div>
                        {button_builder()}

                    </div>
                </StepContent>

            </Step>


        ); 

    }

    return (
        <div> 
            <Modal open={modal_open} onClose={()=>set_modal_open(false)} >
                <Confirmation_Modal sov={sov_data} owner_info={owner_info} project_info={project_info} billing={billing_info} submit_db={submit_db}/> 
            </Modal>
            <Paper>
                <h1> Setup a new contract</h1>
                <Stepper activeStep={current_step} orientation="vertical">
                    {steps.map(build_steps)}
                    

                </Stepper>
                
            </Paper>
            <Paper> 
                {console.log(list)}
            </Paper>
        </div> 
    )
}

export default Job_setup
