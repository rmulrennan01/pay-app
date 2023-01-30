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

   
//AUTH
import {useContext} from 'react'; 
import { UserContext } from "./User_provider";


function Job_setup() {
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [list,set_list] = useState([]); 
     
    //const [loading, setLoading] = useState([]); 

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

    const [billing_info, set_billing_info] = useState({retention: Number(5), due_date: "20th"});
    
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

    const [uid, set_uid] = useState(0); 
    const user = useContext(UserContext);

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(uid==0){set_uid(user.uid); }
            console.log('signed in', user.uid);

        } else {
            console.log('signed out', user);
            window.location='/login/';
        }
    });

    
    const get_job_total = (job_sov) => {
        let temp_sum = 0; 
        if(job_sov.length>0){
            job_sov.map(item=>temp_sum = Number(temp_sum) + Number(item.value)); 
            return temp_sum
        };
        return 0; 

    }
    
    
    //We will keep two copies of the owner data. One is for an owner directory, so we can reuse the same owner.
    //Another copy will be stored inside the project document, so we only have to do one request to access all information
    
    
    const submit_db = () =>{
        let temp_project = project_info;
        let job_total = get_job_total(sov_data);
        let job_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts');
        let owner_ref = firestoreDB.collection('contacts').doc(uid).collection('owners'); 

        //firestoreDB.collection("owners").add(owner_info)

        
        owner_ref.add(owner_info) //UPDATED
        .then((docRef) => {
            console.log("Owner Submission Successful");
            console.log("Owner Info is here: " + docRef.id)
            temp_project["owner_id"] = docRef.id; //need to add the id of the owner document, so we can easily retrieve owner info
            temp_project["owner_name"] = owner_info.name; 
            temp_project["base_contract_value"] = Number(job_total); 
            temp_project["co_count"] = Number(0); 
            temp_project["co_value"] = Number(0); 
            temp_project["app_count"] = Number(0); 
            temp_project["update"] = [];
            temp_project.update.push(new Date());
            temp_project["recent_task"] = []
            temp_project.recent_task.push("Added a new contract"); 
            temp_project["balance"] = Number(job_total);
            temp_project["prev_draws"] = Number(0);
            temp_project["this_draw"] = Number(0); 
            temp_project["retention"] = Number(billing_info.retention)/Number(100);
            temp_project["due_date"] = billing_info.due_date; 
            temp_project["pay_app_dates"] = [];
     
            

            //firestoreDB.collection("contracts").add(temp_project)
            job_ref.add(temp_project)
            .then((docRef2) => {
                console.log("Project Submission Successful");
                console.log("Project Info is here: " + docRef.id)

                let batch = firestoreDB.batch(); 
                sov_data.forEach((doc) => {
                    //let docRef = firestoreDB.collection("contracts").doc(docRef2.id).collection("sov").doc(); 
                    docRef = job_ref.doc(docRef2.id).collection("sov").doc(); 
                    batch.set(docRef,doc); 
                })

                batch.commit()
                .then((docRef3)=>{
                    console.log("submission of sov data complete");
                    alert("New contract added successfully"); 
                    window.location='/contract_browser'; 
                })
                .catch((error) => {
                    console.error("Error adding sov"); 
                }) ; 

                
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
                    <Button variant="contained" onClick={()=>set_current_step(current_step+1)} sx={{mt:2}}> 
                        Continue
                    </Button> 

                );
            }
            else if (index==steps.length-1){
                return(
                    <>
                    <Button variant="contained" onClick={()=>set_modal_open(true)} sx={{mt:2}}> 
                        Submit
                    </Button> 
                    <Button onClick={()=>set_current_step(current_step-1)} sx={{mt:2}}> 
                        Back
                    </Button> 
                    </>
                );
            }
            else{
                return(
                    <>
                    <Button variant="contained" onClick={()=>set_current_step(current_step+1)} sx={{mt:2}}> 
                        Continue
                    </Button> 
                    <Button onClick={()=>set_current_step(current_step-1)} sx={{mt:2}}> 
                        Back
                    </Button> 
                    </>

                )
            }

        };

        return(
            
            <Step key={index}> 
                <StepLabel onClick={()=>set_current_step(index)}> 
                    <h4>{item.label}</h4>
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
            </Paper>
        </div> 
    )
}

export default Job_setup
