import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { PieChart, PieArcSeries } from 'reaviz';

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
import Pay_app_modal from './Contract_page/Pay_app_modal.js'; 
import { getScopedCssBaselineUtilityClass } from '@mui/material';

import CurrencyFormat from 'react-currency-format';



function Contract_page(props) {
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState(); 
    const [loading, set_loading] = useState(true); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const {id} = useParams(); 
    const [co_modal_open, set_co_modal_open] = useState(false); 
    const [pay_modal_open, set_pay_modal_open] = useState(false); 
    const [pay_app_id, set_pay_app_id] = useState(0); 
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
        /*let temp_app_count = 0; 
        if(contract_info.app_count ==null){
            temp_app_count =0; 

        }
        else{
            temp_app_count = contract_info.app_count; 
        }
        */
        firestoreDB.collection("contracts").doc(id).collection("sov").doc(sov_id).update({

            "change_orders": firebase.firestore.FieldValue.arrayUnion({description: data.description, value: data.value, pay_app: data.pay_app})
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
                <h3> 
                    Payment Applications Completed: {contract_info.app_count+1}
                </h3>
                <h3> 
                    Change Orders Submitted: {contract_info.co_count}
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
                    <Pay_app_table id={id} contract_info={contract_info} sov={sov} set_pay_app_id={set_pay_app_id} open_modal={()=>set_pay_modal_open(true)}/> 
                </Paper>
            ); 
        }
    }

    const chart = () => {
        const data = []
        if(contract_info.balance && contract_info.prev_draws && contract_info.this_draw){
             data.push({ key: 'Open Balance ($)', data: contract_info.balance });
             data.push({ key: 'Previous Draws ($)', data: contract_info.prev_draws }); 
             data.push({key: 'Current Draw ($)', data: contract_info.this_draw}); 
               
            

        }
        else{
            data.push({ key: 'Base Contract ($)', data: contract_info.base_contract_value });
            data.push({ key: 'Change Orders ($)', data: contract_info.co_value });
          
  
   
        }
    
        return (
          <PieChart
            width={450}
            height={350}
            data={data}
            series={<PieArcSeries cornerRadius={4} padAngle={0.02} padRadius={200} doughnut={true} colorScheme={"cybertron"} />}
          />
        );

    }

  


    

    
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs = {6}>
                    {job_info()}
                </Grid>
                <Grid item xs = {6}>
                    {job_summary()}
                    {loading? <CircularProgress/> : chart()}

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
            {tab==1 ? <Paper>  <h3> Change Orders </h3> <Button variant="contained" onClick={()=> set_co_modal_open(true)}> Add Change Order </Button><br/>  {change_orders()} </Paper>  : <></>  }
            {tab==2 ? <Paper>  <h3> Payment Applications </h3> {pay_apps()}<br/> </Paper>  : <></>  }
            {console.log("pay_app_id", pay_app_id)}

    

            <Modal open={co_modal_open} onClose={()=>set_co_modal_open(false)}  >
                {loading? <Paper> <CircularProgress/> </Paper> : <Change_order_modal contract_info={contract_info} sov_data={sov} close_modal={()=>set_co_modal_open(false)} submit={submit_co}/> }
            </Modal>
            <Modal open={pay_modal_open} onClose={()=>set_pay_modal_open(false)}  >
                {loading? <Paper> <CircularProgress/> </Paper> : <Pay_app_modal pay_app_id={pay_app_id} contract_info={contract_info} sov_data={sov}  close_modal={()=>set_pay_modal_open(false)} submit={submit_co}/> }
            </Modal>
        </>
  
    )
}

export default Contract_page
