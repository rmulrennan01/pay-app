import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { PieChart, PieArcSeries } from 'reaviz';
import Sov_item_totals from './Utilities/Sov_item_totals.js'; 
import Totals_by_key from './Utilities/Totals_by_key.js'; 

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
import Sov_table from './Pay_app/Sov_table.js';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


function Contract_page(props) {
    const [contract_info, set_contract_info] = useState(); 
    const [owner_info, set_owner_info] = useState(); 
    const [sov, set_sov] = useState(); 
    const [loading, set_loading] = useState(true); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const {id} = useParams(); 
    const [co_modal_open, set_co_modal_open] = useState(false); 
    const [pay_modal_open, set_pay_modal_open] = useState(false); 
    const [pdf_modal_open, set_pdf_modal_open] = useState(false); 
    const [pay_app_id, set_pay_app_id] = useState(0); 
    const [tab, set_tab] = useState(0);   
   



    //fetch the document from firebase
    React.useEffect( () => {
        const fetchData = async () =>{
            const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
            set_contract_info(dataList.data()); 
            //console.log(dataList.data()); 
        
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
        /*
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
        */

        let rev_contract = Number(contract_info.base_contract_value) + Number(contract_info.co_value) + Number(data.value); 
        let balance = Number(rev_contract) - Number(contract_info.prev_draws) - Number(contract_info.this_draw); 
        
        let batch = firestoreDB.batch(); 
        let contract_ref = firestoreDB.collection("contracts").doc(id); 
        let sov_ref = contract_ref.collection("sov").doc(sov_id);
    
        //BATCH UPDATE WITH THE CO -> MUST UPDATE CO_COUNT; CO_VALUE; BALANCE; CO INSIDE SOV

        batch.update(sov_ref, {"change_orders": firebase.firestore.FieldValue.arrayUnion({description: data.description, value: Number(data.value), pay_app: Number(data.pay_app)})});//DONE
        batch.update(contract_ref, {"co_value":Number(contract_info.co_value)+Number(data.value)}); //DONE
        batch.update(contract_ref, {"co_count":Number(contract_info.co_count)+Number(1)}); //DONE
        batch.update(contract_ref, {"balance":Number(balance)}); //DONE

        batch.commit().then(()=>{
            console.log("updated co total successfully"); 
            alert("Change Order Added Successfully"); 
            window.location.reload(false);
        })
        .catch((error) => {
            console.error("Error adding change order", error); 
            alert("Failed to submit change order. Please try again later or contact support.")
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
                    Payment Applications Completed: {contract_info.app_count}
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
                    <Contract_sov sov_data={sov} contract_info={contract_info}/> 
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
                    <Change_order_table sov={sov} contract_info={contract_info}/> 
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

    const chart_contract = () => {
        const data = []
        data.push({ key: 'Base Contract ($)', data: contract_info.base_contract_value });
        data.push({ key: 'Change Orders ($)', data: contract_info.co_value });


        return (
          <PieChart
            width={450}
            height={350}
            data={data}
            series={<PieArcSeries cornerRadius={4} padAngle={0.02} padRadius={200} doughnut={true} colorScheme={"cybertron"} />}
          />
        );

    }

    const chart_draws = () => {
        const data = []
        data.push({ key: 'Open Balance ($)', data: contract_info.balance });
        data.push({ key: 'Previous Draws ($)', data: contract_info.prev_draws }); 
        data.push({key: 'Current Draw ($)', data: contract_info.this_draw}); 
               
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
            {loading? null : console.log(Sov_item_totals(sov,3,0.05))}
            {loading? null : console.log(Totals_by_key(Sov_item_totals(sov,3,0.05),"prev_draws"))}
            <Grid container spacing={2}>
                <Grid item xs = {6}>
                    {job_info()}
                </Grid>
                <Grid item xs = {6}>
                    {job_summary()}
                    

                </Grid>
                <Grid item xs = {6}>
                    <Paper>{loading? <CircularProgress/> : chart_contract()}</Paper>
                </Grid>
                <Grid item xs = {6}>
                    <Paper>{loading? <CircularProgress/> : chart_draws()}</Paper>
                </Grid>


            </Grid>
            <br/> 
            <br/>
            <Tabs value={tab}  centered>
                <Tab label={<Button endIcon={<AttachMoneyIcon/>}><h3>Payment Applications</h3></Button>} onClick={()=>set_tab(0)}/>   
                <Tab label={<Button endIcon={<ReceiptLongIcon/>}><h3>Schedule of Values</h3> </Button>} onClick={()=>set_tab(1)}/>
                <Tab label={<Button endIcon={<CurrencyExchangeIcon/>}><h3>Change Orders</h3></Button>} onClick={()=>set_tab(2)}/>
                
            </Tabs>
            
            {tab==0 ? <Paper>   {pay_apps()}<br/> </Paper>  : <></>  }
            {tab==1 ? <Paper>   {job_sov()}<br/> </Paper>  : <></>  }
            {tab==2 ? <Paper>   <Button variant="contained" onClick={()=> set_co_modal_open(true)}> Add Change Order </Button><br/>  {change_orders()} </Paper>  : <></>  }
            
            

    

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
