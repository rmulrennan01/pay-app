import React, {useState,useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Activity_update from './Database_util/Activity_update.js'
import Sov_item_totals from './Utilities/Sov_item_totals.js'; 
import Totals_by_key from './Utilities/Totals_by_key.js'; 


import Sov_table from './Pay_app/Sov_table.js'; 
import Billing_details from './Pay_app/Billing_details.js'; 

import Change_orders from './Pay_app/Change_orders.js';
import Pay_app_viewer from './Pay_app_viewer.js';  

//For pay app review modal
import Modal from '@mui/material/Modal';

//AUTH
import {useContext} from 'react'; 
import { UserContext } from "./User_provider";

import Add_app from './Database_util/Add_app.js'; 

////Stepper
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { CollectionsOutlined } from '@material-ui/icons';




function Pay_app() {
    const {id} = useParams(); 
    const [contract_info, set_contract_info] = useState([]); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState([]); 
    const [loading, set_loading] = useState(true); 
    const [saved_inputs, set_saved_inputs] = useState([]); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [bill_retention, set_bill_retention] = useState(false); 
    const [modal_open, set_modal_open] = useState(false); 
    const [balance, set_balance] = useState(Number(0)); 
    const [preview_sov, set_preview_sov]  = useState([]); 
    const [preview_contract_info, set_preview_contract_info] = useState({}); 
    const [current_step, set_current_step] = useState(0); 
    const [line_items, set_line_items] = useState([]); 
    const [app_date, set_app_date] = useState(new Date);
  

    //FUNCTION TO LIFT STATE OF USER INPUTS IN THE SOV STEP UP. 
    const update_billed_to_date = (inputs) =>{
        set_saved_inputs(inputs); 
        let draw_total = Number(0);
        //CALCULATE TOTAL OF THE USER INPUTS
        if(saved_inputs.length > 0){
            for (let i=0; i < saved_inputs.length; i++){
                draw_total += Number(saved_inputs[i]); 

            }
        }
        set_balance(draw_total); 
    }

    const preview = () => {
        return(
            <>
                <div> Please review the application before continuing to the submission step. </div>
                <Button onClick={()=>handle_preview_click()}> Preview Application </Button> <br/> 
            </>
        );
    }
    
  


    //EACH SECTION TO BE USED FOR THE STEPPER. INCLUDES THE REACT COMPONENT TO RENDER FOR EACH SECTION.
    const steps = [       
        {label: 'Getting Started', content: <div>If you wish to bill in full immediately, click the skip button below.</div>},
            {label: 'Work Completed', 
            content: <Sov_table line_items={line_items} contract_info={contract_info} saved_inputs={saved_inputs} update_inputs={update_billed_to_date} />},
        {label: 'Billing Details', content: 
            <Billing_details 
                set_app_date={set_app_date} 
                app_date = {app_date}
                balance={balance} 
                bill_retention={bill_retention} 
                update_bill_retention={(item)=>set_bill_retention(item)}/>},
        {label: 'Preview', content: preview()},
        {label: 'Submission' , content: <div></div>}
    ];
    
     //auth
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
 
   
    //FETCH THE DATA
    useEffect( () => {
        const fetchData = async () =>{
            let job_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts');
            let owner_ref = firestoreDB.collection('contacts').doc(uid).collection('owners'); 

            //LOAD CONTRACT_INFO
            //const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
            const dataList = await job_ref.doc(id).get(); //updated
            set_contract_info(dataList.data()); 
            
            //LOAD OWNER_INFO
            //const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
            const dataList2 = await owner_ref.doc(dataList.data().owner_id).get(); //updated
            set_owner_info(dataList2.data()); 

            //LOAD THE SOV DATA FOR THE CONTRACT
            const tempList = []; 
            //const dataList3 = await firestoreDB.collection("contracts").doc(id).collection("sov").get();
            const dataList3 = await job_ref.doc(id).collection("sov").get();
            dataList3.forEach((doc) => {
                let tempDict = doc.data(); 
                tempDict["id"] = doc.id; 
                tempList.push(tempDict); 
            });
            console.log("sov at fetch", tempList); 

            set_sov(tempList); 
            set_loading(false); 
        }
        fetchData(); 
    }, [uid]);  

    useEffect(() => {
           set_line_items(contract_info != null && sov !=null ? Sov_item_totals(sov,contract_info.app_count,contract_info.retention) : []); 
    }, [loading, contract_info, sov]);


    //TAKE THE SOV DATA AND CONVERT INTO LIST OF JSON OBJECTS REPRESENTING SUMMARY DATA FOR EACH INDIVIDUAL LINE ITEM
    useEffect(() => {
        if(sov.length>0){
             set_line_items(Sov_item_totals(sov,Number(contract_info.app_count),0.05)); 
        }
    }, [loading]);
    




    const submit_pay_app = () =>{
        Add_app(contract_info, sov, saved_inputs, app_date, uid, id); 
    }

 

    //CALLED UPON CLICKING THE PREVIEW BUTTON
    const handle_preview_click = () => {
        adjust_data(); 
        set_modal_open(true)
        
    }



    //CREATES A CONVERTED VERSION OF THE SOV & CONTRACT_INFO THAT APPENDS THE USER INPUT DRAW AMOUNTS
    //THIS IS REQUIRED IN ORDER TO FEED TO THE PAY_APP_VIEWER
    const adjust_data = () => {
        let temp_sov = JSON.parse(JSON.stringify(sov)); //CREATE A DEEP COPY
        let temp_contract_info = JSON.parse(JSON.stringify(contract_info)); //CREATE A DEEP COPY
        let temp_draw = Number(0); 

        
        for (let i=0; i<temp_sov.length; i++){
            //IF MISSING A PAY APP LIST - NEED TO ADD
            if(!temp_sov[i].hasOwnProperty("pay_apps")){
                temp_sov[i].pay_apps = [];
            }

            if(saved_inputs == [] || saved_inputs[i] == null || saved_inputs[i] == ""){
                temp_sov[i].pay_apps[contract_info.app_count] = Number(0);
            }
            else{
                if(saved_inputs[i] != undefined){
                    temp_sov[i].pay_apps[contract_info.app_count]=saved_inputs[i];
                    temp_draw += Number(saved_inputs[i]);
                }
            }
        }

        set_preview_sov(temp_sov); 

        temp_contract_info.prev_draws = Number(contract_info.prev_draws) + Number(contract_info.this_draw);
        temp_contract_info.this_draw = Number(temp_draw); 
        //temp_contract_info.balance = Number(contract_info.balance) - Number(temp_draw); 
        temp_contract_info.balance = Number(contract_info.base_contract_value) + Number(contract_info.co_value) - temp_contract_info.prev_draws - temp_contract_info.this_draw;
        temp_contract_info.app_count = Number(contract_info.app_count); 
        set_preview_contract_info(temp_contract_info); 

    }



    //LOGIC FOR THE STEPPER ELEMENTS
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
                    <div> By clicking the generate application button below, the user acknolwdges responsiblity in verfiying the accuracy
                        of the content. </div>
                    <Button variant="contained" onClick={()=>submit_pay_app()} sx={{mt:2}}> 
                        Save & Submit
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
                        {loading ? null : item.content }
                    </div>
                    <div>
                        {button_builder()}
                    </div>
                </StepContent>
            </Step>
        ); 
    }



    return (
        <div style={{margin:"15px"}}>

            <Stepper activeStep={current_step} orientation="vertical">
                {steps.map(build_steps)}
            </Stepper>


            {loading ? null :
            <Modal open={modal_open} onClose={()=>set_modal_open(false)}  >
   
                <Paper sx={{mt:5, mb:40, ml:40, padding: 2, width:1220}}> 
                    < > 
                        
                        {preview_sov == [] ? null : 
                            <Pay_app_viewer 
                            draft={true} 
                            app_id={contract_info.app_count+1} 
                            contract_info={preview_contract_info} 
                            owner_info={owner_info} 
                            sov={preview_sov}
                            app_date={app_date}
                            end_date={new Date(app_date.getFullYear(),app_date.getMonth()+1,0)}
                            />
                        }
                        <Button variant="contained" onClick={()=>set_modal_open(false)}> Close </Button>
                   </>
                
                </Paper> 
                    
                
            </Modal>
            }
        </div>
    )
}

export default Pay_app
