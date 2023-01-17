import React, {useState,useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Sov_item_totals from './Utilities/Sov_item_totals.js'; 
import Totals_by_key from './Utilities/Totals_by_key.js'; 

import Sov_table from './Pay_app/Sov_table.js'; 
import Billing_details from './Pay_app/Billing_details.js'; 

import Change_orders from './Pay_app/Change_orders.js';
import Pay_app_viewer from './Pay_app_viewer.js';  

//For pay app review modal
import Modal from '@mui/material/Modal';




////Stepper
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Bathtub } from '@material-ui/icons';
import Pay_app_modal_table from './Contract_page/Pay_app_modal_table.js';
//import Billing_details from './Job_setup/Billing_Details.js';


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
        {label: 'Billing Details', content: <Billing_details  balance={balance} bill_retention={bill_retention} update_bill_retention={(item)=>set_bill_retention(item)}/>},
        {label: 'Preview', content: preview()},
        {label: 'Submission' , content: <div></div>}
    ];
    
   
    //FETCH THE DATA
    useEffect( () => {
        const fetchData = async () =>{

            //LOAD CONTRACT_INFO
            const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
            set_contract_info(dataList.data()); 
            
            //LOAD OWNER_INFO
            const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
            set_owner_info(dataList2.data()); 

            //LOAD THE SOV DATA FOR THE CONTRACT
            const tempList = []; 
            const dataList3 = await firestoreDB.collection("contracts").doc(id).collection("sov").get();
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
    }, []);  

    useEffect(() => {
           set_line_items(contract_info != null && sov !=null ? Sov_item_totals(sov,contract_info.app_count,contract_info.retention) : []); 
    }, [loading, contract_info, sov]);


    //TAKE THE SOV DATA AND CONVERT INTO LIST OF JSON OBJECTS REPRESENTING SUMMARY DATA FOR EACH INDIVIDUAL LINE ITEM
    useEffect(() => {
        if(sov.length>0){
             set_line_items(Sov_item_totals(sov,Number(contract_info.app_count),0.05)); 
        }
    }, [loading]);
    


    const submission_success = () => {
        alert("Pay App Added Successfully. You will now be redirected to the contract page"); 
        window.location='/contract/'+ String(id)

    }


    const submit_pay_app = () => {
        let batch = firestoreDB.batch(); 
        let contract_ref = firestoreDB.collection("contracts").doc(id); 
        let sov_ref = contract_ref.collection("sov"); 
        let temp_sov = []; 
        let draw_total = Number(0);

        console.log('SOV', sov); 

        //batch.update(sov_ref, {"change_orders": firebase.firestore.FieldValue.arrayUnion({description: data.description, value: Number(data.value), pay_app: Number(data.pay_app)})});//DONE

        
        for (let i = 0; i<sov.length; i++){
            if(saved_inputs[i] ==""){
                //temp_sov[i].pay_apps.push(Number(0)); 
                batch.update(sov_ref.doc(sov[i].id), {"pay_apps": firebase.firestore.FieldValue.arrayUnion(Number(0))});
            }
            else{
                //temp_sov[i].pay_apps.push(Number(saved_inputs[i]))
                //console.log('saved inputs', saved_inputs)
                batch.update(sov_ref.doc(sov[i].id), {"pay_apps": firebase.firestore.FieldValue.arrayUnion(Number(saved_inputs[i]))}); 

            }
            draw_total += Number(saved_inputs[i]); 
        }
        
        

        let date = new Date();
        let rev_prev_draws = Number(contract_info.prev_draws)+Number(contract_info.this_draw);
        let period_balance = Number(contract_info.base_contract_value)+Number(contract_info.co_value)-Number(rev_prev_draws)-Number(draw_total); 


        batch.update(contract_ref, {"prev_draws":rev_prev_draws});
        batch.update(contract_ref, {"this_draw":Number(draw_total)});
        batch.update(contract_ref, {"balance":period_balance});
        batch.update(contract_ref, {"recent_task":"Added a payment application"});
        batch.update(contract_ref, {"update":date});
        batch.update(contract_ref, {"app_count":Number(contract_info.app_count + Number(1))});

         
        console.log('saved inputs', saved_inputs)
        batch.commit().then(()=>{
            submission_success();  
        })
        .catch((error) => {
            console.error("Error adding pay app", error); 
            alert("Failed to submit payment application. Please try again later.")
        });
        

    }

    //CALLED UPON CLICKING THE PREVIEW BUTTON
    const handle_preview_click = () => {
        adjust_data(); 
        set_modal_open(true)
        
    }



    //CREATES A CONVERTED VERSION OF THE SOV & CONTRACT_INFO THAT APPENDS THE USER INPUT DRAW AMOUNTS
    //THIS IS REQUIRED IN ORDER TO FEED TO THE PAY_APP_VIEWER
    const adjust_data = () => {
        let temp_sov = sov; 
        let temp_contract_info = contract_info; 
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
                    <Button onClick={()=>set_current_step(current_step+1)}> 
                        Continue
                    </Button> 
                );
            }
            else if (index==steps.length-1){
                return(
                    <>
                    <div> By clicking the generate application button below, the user acknolwdges responsiblity in verfiying the accuracy
                        of the content. </div>
                    <Button onClick={()=>submit_pay_app()}> 
                        Save & Submit
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
        <div>

            <Stepper activeStep={current_step} orientation="vertical">
                {steps.map(build_steps)}
                

            </Stepper>


            {loading ? null :
            <Modal open={modal_open} onClose={()=>set_modal_open(false)}  >
   
                <Paper > 
                    <Paper sx={{width:400}}> 
                        
                        {preview_sov == [] ? null : 
                            <Pay_app_viewer 
                            draft={true} 
                            app_id={contract_info.app_count+1} 
                            contract_info={preview_contract_info} 
                            owner_info={owner_info} 
                            sov={preview_sov}/>
                        }
                    </Paper>
                    : 
                    <> </>
                
                </Paper> 
                    
                
            </Modal>
            }
        </div>
    )
}

export default Pay_app
