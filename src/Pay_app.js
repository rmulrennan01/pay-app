import React, {useState,useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 

import Sov_table from './Pay_app/Sov_table.js'; 
import Billing_details from './Pay_app/Billing_details.js'; 
import Change_orders from './Pay_app/Change_orders.js'; 

////Stepper
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
//import Billing_details from './Job_setup/Billing_Details.js';


function Pay_app() {
    const {id} = useParams(); 
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState([]); 
    const [loading, set_loading] = useState(true); 
    const [saved_inputs, set_saved_inputs] = useState([]); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [prev_draws, set_prev_draws] = useState([]); 
    const [co_sums, set_co_sums] = useState([]); 
    const [contract_total, set_contract_total] = useState(0); 
    const [co_total, set_co_total] = useState(0); 
    const [balance, set_balance] = useState(0); 
    
    const [current_step, set_current_step] = useState(0); 
    const steps = [       
        {label: 'Getting Started', content: <div>If you wish to bill in full immediately, click the skip button below.</div>},
            {label: 'Work Completed', 
            content: <Sov_table sov_data={sov} prev_draws={prev_draws} co_sums={co_sums} saved_inputs={saved_inputs} update_inputs={(item)=>set_saved_inputs(item)} balance={(item)=>set_balance(item)}/>},
        {label: 'Billing Details', content: <Billing_details contract_total={contract_total} co_sum={co_total} prev_draws={prev_draws} co_sums={co_sums} balance={balance}/>},
        {label: 'Recap', content: <div></div>}
    ];
    const [modal_open, set_modal_open] = useState(false); 


        //fetch the document from firebase
        useEffect( () => {
            const fetchData = async () =>{
                const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
                set_contract_info(dataList.data()); 
                console.log(dataList.data()); 
            
                const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
                set_owner_info(dataList2.data()); 
    
                const tempList = []; 
    
    
                const dataList3 = await firestoreDB.collection("contracts").doc(id).collection("sov").get();
                dataList3.forEach((doc) => {
                    let tempDict = doc.data(); 
                    tempDict["id"] = doc.id; 
                    //tempDict["parent"] = doc.ref.parent.path.slice(0,-4); 
                    tempList.push(tempDict); 
                    //console.log("HERE:" , doc.ref.parent.path.slice(0,-4)); 
                });
    
                //console.log(tempList); 
                set_sov(tempList); 
                set_loading(false); 
                
            }
            fetchData(); 
            
    
            
        }, []);  

        useEffect(() => {
           
            get_previous_draws(); 
            get_co_sums(); 
            console.log("hey hey", contract_info); 
            set_contract_total(contract_info ? contract_info.base_contract_value : 0); 
            set_co_total(contract_info ? contract_info.co_value : 0); 
            
        }, [loading, contract_info])
    


    const get_previous_draws = () =>{
        let temp_sums = []; 
        let sum = 0; 
        console.log("this is the sov here: ", sov); 
        for (var i = 0; i<sov.length; i++){
            if(sov[i].hasOwnProperty('pay_apps')){
                if(sov[i].pay_apps.length >0){
                    sov[i].pay_apps.map(item=>sum = Number(sum) + Number(item.value)); 
                    temp_sums[i] = sum; 
                } 
                else{
                    temp_sums[i] = 0; 
                }
            }
            else{
                temp_sums.push(0); 
            }
            sum = 0; 
        }
        set_prev_draws(temp_sums);  
        console.log("built previous draws: ", prev_draws)
    }

    const get_co_sums = () =>{
        let temp_sums = []; 
        let sum = 0; 
        for (var i = 0; i<sov.length; i++){
            if(sov[i].change_orders.length >0){
                sov[i].change_orders.map(item=>sum = Number(sum) + Number(item.value)); 
                temp_sums[i] = sum; 
            } 
            else{
                temp_sums[i] = 0; 
            }
            sum = 0; 
        }
        set_co_sums(temp_sums);  
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
                    <div> By clicking the generate application button below, the user acknolwdges responsiblity in verfiying the accuracy
                        of the content. </div>
                    <Button onClick={()=>set_modal_open(true)}> 
                        Generate Application
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
        </div>
    )
}

export default Pay_app
