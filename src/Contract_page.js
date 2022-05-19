import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';


import Contract_sov from "./Contract_page/Contract_sov.js"; 
import Change_order_modal from './Contract_page/Change_order_modal.js';
import { getScopedCssBaselineUtilityClass } from '@mui/material';

function Contract_page(props) {
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState(); 
    const [loading, set_loading] = useState(true); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const {id} = useParams(); 
    const [modal_open, set_modal_open] = useState(false); 
   



    //fetch the document from firebase
    React.useEffect( () => {
        const fetchData = async () =>{
            const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
            set_contract_info(dataList.data()); 
        
            const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
            set_owner_info(dataList2.data()); 

            const tempList = []; 

            /*
            firestoreDB.collection("contracts").doc(id).collection("sov").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data() != null){ tempList.push(doc.data());};  
                });
            });
            
`           */

            const dataList3 = await firestoreDB.collection("contracts").doc(id).collection("sov").get();
            dataList3.forEach((doc) => {
                tempList.push(doc.data()); 
                console.log(doc.data()); 
            });

            console.log(tempList); 
            set_sov(tempList); 
            set_loading(false); 
            
        }
        fetchData(); 

        
    }, []);  



    const submit_db = (cost_code) =>{
        firestoreDB.collection("contracts").document(id).collection("sov").add(owner_info)
        .then((docRef) => {
            console.log("Owner Submission Successful");
            
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
    


    const job_info = () => {

        if(loading){
            return(
                <Paper>
                    <CircularProgress/> 
                </Paper>
                );
        }
        else {
            return(
                <Paper>
                    
                    <h3>  Contract: </h3>  
                    {contract_info.name} <br/>
                    {contract_info.address_01} <br/>
                    {contract_info.address_02!=""? <>{contract_info.address_02} <br/> </>:<></>}
                    {contract_info.city}, {contract_info.state} {contract_info.zip}
                    <br/> <br/> 
                    
                    <h3> Owner: </h3> 
                    {owner_info.name} <br/>
                    {owner_info.address_01} <br/>
                    {owner_info.address_02!=""? <>{owner_info.address_02} <br/> </>:<></>}
                    
                    {owner_info.city}, {owner_info.state} {owner_info.zip}

                </Paper>
            ); 

        }
    }

    const job_sov = () => {

        if(loading){
            return(
                <Paper>
                 <CircularProgress/> 
                </Paper>
                ); 
        }
        else {
            return(
                <Paper>
                    
                    <Contract_sov sov_data={sov} /> 

                </Paper>
            ); 

        }
    }

  


    


    return (
        <>
            {job_info()}
            <br/> 
            <h3> Schedule of Values </h3> 
            {job_sov()}
            <br/> 
            <h3> Change Orders </h3> <Button variant="contained" onClick={()=> set_modal_open(true)}> Add Change Order </Button>
            <br/> 
            <h3> Payment Applications </h3> 


            <Modal open={modal_open} onClose={()=>set_modal_open(false)} >
                {loading? <Paper> <CircularProgress/> </Paper> : <Change_order_modal sov_data={sov} close_modal={()=>set_modal_open(false)}/> }
            </Modal>
        </>
  
    )
}

export default Contract_page
