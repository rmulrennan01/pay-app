import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 

import Sov_table from './Pay_app/Sov_table.js'; 
import Change_orders from './Pay_app/Change_orders.js'; 

////Stepper
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';


function Pay_app() {
    const {id} = useParams(); 
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState(); 
    const [loading, set_loading] = useState(true); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    /*const [sov, set_sov] =useState([{value: 25000, change_orders: 0, description: "Asphalt Roof Labor"}, 
        {value: 30000,change_orders: 0,description: "Asphalt Roof Material"}, 
        {value: 60000,change_orders: 5000, description: "TPO Roof Material"},
        {value: 65000,change_orders: 0, description: "TPO Roof Labor"} ]);
    */
    
    const [current_step, set_current_step] = useState(0); 
    const steps = [
        
        
        {label: 'Work Completed', content: <Sov_table sov_data={sov}/>},
        {label: 'Billing Details', content: <div></div>},
        {label: 'Recap', content: <div></div>}
    ];
    const [modal_open, set_modal_open] = useState(false); 


        //fetch the document from firebase
        React.useEffect( () => {
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
    
                console.log(tempList); 
                set_sov(tempList); 
                set_loading(false); 
                
            }
            fetchData(); 
    
            
        }, []);  
    





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
