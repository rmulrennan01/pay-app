import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';

import Grid from '@mui/material/Grid';


import Contract_sov from "./Contract_page/Contract_sov.js"; 
import Change_order_modal from './Contract_page/Change_order_modal.js';
import Change_order_table from './Contract_page/Change_order_table.js'; 
import Pay_app_table from './Contract_page/Pay_app_table.js'; 
import { getScopedCssBaselineUtilityClass } from '@mui/material';

import CurrencyFormat from 'react-currency-format';


function Contract_page(props) {
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState(); 
    const [loading, set_loading] = useState(true); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const {id} = useParams(); 
    const [modal_open, set_modal_open] = useState(false); 
    const [tab, set_tab] = useState(0);   
   



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


    /*
    const submit_db = (cost_code) =>{
        firestoreDB.collection("contracts").document(id).collection("sov").add(owner_info)
        .then((docRef) => {
            console.log("Owner Submission Successful");
            
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
    */

    const submit_co = (sov_id, data) => {
        //add the change order to the appropriate sov data item
        firestoreDB.collection("contracts").doc(id).collection("sov").doc(sov_id).update({
            "change_orders": firebase.firestore.FieldValue.arrayUnion({description: data.description, value: data.value})
        })
        .then((docRef) => {
            console.log("added CO successfully"); 
        })
        .catch((error) => {
            console.error("Error adding change order info", error); 
        });
        //update the change order quantitiy count and change order dollar total
        const delta = firebase.firestore.FieldValue.increment(data.value); 
        firestoreDB.collection("contracts").doc(id).update({
            "co_value": delta
        })
        .then((docRef) => {
            console.log("updated co total successfully"); 
            alert("Change Order Added Successfully"); 
            window.location.reload(false);
            
        })
        .catch((error) => {
            console.error("Error updating change order total", error); 
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


    const job_summary = () =>{
        if(loading){
            return(
                <Paper>
                    <CircularProgress/> 
                </Paper>
                );
        }
        else{
        
        return(
            <Paper>
                <h3>Base Contract: <span> 
                    <CurrencyFormat 
                        value={contract_info.base_contract_value} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    /> 
                </span> 
                </h3> 
                <h3>Change Orders: <span> 
                    <CurrencyFormat 
                        value={contract_info.co_value} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    /> 
                </span> 
                
                </h3> 
                <h3>Contract Total: <span> 
                    <CurrencyFormat 
                        value={Number(contract_info.base_contract_value)+Number(contract_info.co_value)} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    /> 
                </span> 
                
                </h3> 
            </Paper>
        )
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

    const change_orders = () => {
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
                    <Change_order_table co_data={sov} /> 
                </Paper>
            ); 
        }
    }

    const pay_apps = () => {
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
                    <Pay_app_table id={id}/> 
                </Paper>
            ); 
        }
    }

  


    

    
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs = {6}>
                    {job_info()}
                </Grid>
                <Grid item xs = {6}>
                    {job_summary()}

                </Grid>

            </Grid>
            <br/> 
            <br/>
            <Tabs value={tab}  centered>
                <Tab label={<h3>Schedule of Values</h3>} onClick={()=>set_tab(0)}/>
                <Tab label={<h3>Change Orders</h3>} onClick={()=>set_tab(1)}/>
                <Tab label={<h3>Payment Applications</h3>} onClick={()=>set_tab(2)}/>
            </Tabs>
            {console.log(tab)}

            {tab==0 ? <Paper>  <h3> Contract Summary </h3> {job_sov()}<br/> </Paper>  : <></>  }
            {tab==1 ? <Paper>  <h3> Change Orders </h3> <Button variant="contained" onClick={()=> set_modal_open(true)}> Add Change Order </Button><br/>  {change_orders()} </Paper>  : <></>  }
            {tab==2 ? <Paper>  <h3> Payment Applications </h3> {pay_apps()}<br/> </Paper>  : <></>  }
            

    

            <Modal open={modal_open} onClose={()=>set_modal_open(false)}  >
                {loading? <Paper> <CircularProgress/> </Paper> : <Change_order_modal sov_data={sov} close_modal={()=>set_modal_open(false)} submit={submit_co}/> }
            </Modal>
        </>
  
    )
}

export default Contract_page
