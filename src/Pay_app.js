import React, {useState,useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 

import Sov_table from './Pay_app/Sov_table.js'; 
import Billing_details from './Pay_app/Billing_details.js'; 
import Page_G702 from './Pay_app/Page_G702.js'; 
import Page_G703 from './Pay_app/Page_G703.js'; 
import Change_orders from './Pay_app/Change_orders.js';
import Pay_app_viewer from './Pay_app_viewer.js';  

//For pay app review modal
import Modal from '@mui/material/Modal';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


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
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState([]); 
    const [loading, set_loading] = useState(true); 
    const [saved_inputs, set_saved_inputs] = useState([]); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [prev_draws, set_prev_draws] = useState([]); 
    const [prev_draws_total, set_prev_draws_total] = useState(0); 
    const [co_sums, set_co_sums] = useState([]); 
    const [contract_total, set_contract_total] = useState(0); 
    const [co_total, set_co_total] = useState(0); 
    const [balance, set_balance] = useState(0); 
    const [bill_retention, set_bill_retention] = useState(false); 
    const [this_draw_total, set_this_draw_total] = useState(0); 
    
    const update_billed_to_date = (inputs) =>{
        set_saved_inputs(inputs); 
        let temp = 0; 
        
        inputs.map((item) => temp += Number(item));        
        set_this_draw_total(temp)
    }

    
    const [current_step, set_current_step] = useState(0); 
    const preview = () => {
        return(
            <>
            <div> Please review the application before continuing to the submission step. </div>
            <Button onClick={()=>set_modal_open(true)}> 
                Preview Application
            </Button> <br/> 
            </>

        );

    }
    const steps = [       
        {label: 'Getting Started', content: <div>If you wish to bill in full immediately, click the skip button below.</div>},
            {label: 'Work Completed', 
            content: <Sov_table sov_data={sov} prev_draws={prev_draws} prev_draws_total={prev_draws_total} co_sums={co_sums} saved_inputs={saved_inputs} update_inputs={update_billed_to_date} balance={(item)=>set_balance(item)} />},
        {label: 'Billing Details', content: <Billing_details  balance={balance} bill_retention={bill_retention} update_bill_retention={(item)=>set_bill_retention(item)}/>},
        {label: 'Preview', content: preview()},
        {label: 'Submission' , content: <div></div>}
    ];
    
    const [modal_open, set_modal_open] = useState(false); 
    const [modal_index, set_modal_index] = useState(0); 
    


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
            //console.log("hey hey", contract_info); 
            set_contract_total(contract_info ? contract_info.base_contract_value : 0); 
            set_co_total(contract_info ? contract_info.co_value : 0); 
            
        }, [loading, contract_info, sov])
    

    
    const get_previous_draws = () =>{
        let temp_sums = []; 
        let sum = 0; 
        let total = 0; 
        //console.log("this is the sov here: ", sov); 
        for (var i = 0; i<sov.length; i++){
           // console.log("sov", sov); 
            if(sov[i].hasOwnProperty('pay_apps')){
                if(sov[i].pay_apps.length >0){
                    sov[i].pay_apps.map(item=>sum = Number(sum) + Number(item)); 
                    temp_sums[i] = sum; 
                    //console.log("here2:",sum);
                    total +=sum; 
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
        set_prev_draws_total(total); 
        //set_prev_draws_total(total); 
        console.log("total",total)
        //console.log("prev draws total: ", total)
    }



    const get_co_sums = () =>{
        console.log("This is sov", sov); 
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

    const submit_pay_app = () => {
        //make a copy of the current sov and append pay app values to each item
        let temp_sov = sov; 
        temp_sov.map((item,index)=>{
            if(!item.pay_apps){
                
                item["pay_apps"] =[]
            }
            if(saved_inputs[index]==""){
                item.pay_apps.push(0)

            }
            else{
                item.pay_apps.push(saved_inputs[index])
            }
        });
        console.log("updated sov", temp_sov); 
        console.log("prev_draws_total", prev_draws_total); 
        console.log("this_draw_total", this_draw_total); 
        console.log("balance", balance); 

        let batch = firestoreDB.batch(); 
        let contract_ref = firestoreDB.collection("contracts").doc(id); 
        let sov_ref = contract_ref.collection("sov"); 
        
        sov.map((item,) => {
            batch.update(sov_ref.doc(item.id), {"pay_apps": item.pay_apps}); 


        });


        //batch.set(sov_ref, {sov:temp_sov}); 
        batch.update(contract_ref, {"prev_draws":Number(prev_draws_total)});
        batch.update(contract_ref, {"this_draw":Number(this_draw_total)});
        batch.update(contract_ref, {"balance":Number(balance)});
        batch.update(contract_ref, {"balance":Number(balance)});
        batch.update(contract_ref, {"app_count":Number(contract_info.app_count + Number(1))});
        batch.commit().then(()=>{
            alert("App Submitted"); 
        })
        .catch((error) => {
            console.error("Error adding pay app", error); 
        });

        //backup pay_app status
        //saved_inputs, prev_draws_total, this_draw_total, balance


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
                        <Pay_app_viewer draft={true} app_id={contract_info.app_count+1} contract_info={contract_info} owner_info={owner_info} sov={sov}/>
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
