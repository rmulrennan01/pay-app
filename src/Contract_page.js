import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { PieChart, PieArcSeries } from 'reaviz';
import Date_string from './Utilities/Date_string.js'; 
import Bar_chart from './Utilities/Bar_chart.js'; 
import Period_totals from './Utilities/Period_totals';

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

import AddCircleIcon from '@mui/icons-material/AddCircle'; 
import { AccountBalanceWalletOutlined } from '@material-ui/icons';
import { blue } from '@mui/material/colors';



function Contract_page(props) {
    const [contract_info, set_contract_info] = useState([]); 
    const [owner_info, set_owner_info] = useState([]); 
    const [sov, set_sov] = useState([]); 
    const [loading, set_loading] = useState(true); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const {id} = useParams(); 
    const [co_modal_open, set_co_modal_open] = useState(false); 
    const [pay_modal_open, set_pay_modal_open] = useState(false); 
    const [pdf_modal_open, set_pdf_modal_open] = useState(false); 
    const [pay_app_id, set_pay_app_id] = useState(0); 
    const [tab, set_tab] = useState(0);   
   



    //fetch the document from firebase
    useEffect( () => {
        const fetchData = async () =>{
            const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
            set_contract_info(dataList.data()); 
            set_deadlines(get_deadlines(dataList.data().due_date))

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
           //get_deadlines();
            set_loading(false); 
            
        }
        fetchData(); 

        
    }, []);  


    useEffect( () => {
        build_table_data();
        
    }, [contract_info, sov]); 


  
    //SUBMIT A NEW CHANGE ORDER
    const submit_co = (sov_id, data) => {
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

        //RECENT TASKS
        let temp_update = [...contract_info.update];
        temp_update.push(new Date); 
        let temp_tasks = [...contract_info.recent_task];
        temp_tasks.push("Added a change order for "+ data.description)
        if(temp_update.length > 10){ //CAN'T EXCEED FIVE ITEMS
            temp_update.shift();
            temp_tasks.shift();
        }
        batch.update(contract_ref, {"update":temp_update}); //DONE
        batch.update(contract_ref, {"recent_task":temp_tasks}); //DONE


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

    //SUBMIT A REVISION TO A PAY APPLICATION
    const submit_app_changes = (inputs) =>{
        let batch = firestoreDB.batch(); 
        let contract_ref = firestoreDB.collection("contracts").doc(id);

        //UPDATE THE LAST INDEX OF EACH PAY APP IN THE SOV TO BE THE USER INPUTS
        let temp_sov = JSON.parse(JSON.stringify(sov)); //CREATE A DEEP COPY
        let rev_draw = Number(0); 
        for (let i=0; i<temp_sov.length; i++){
            let temp_sov_ref = contract_ref.collection("sov").doc(temp_sov[i].id);
            temp_sov[i].pay_apps.pop(); 
            temp_sov[i].pay_apps.push(Number(inputs[i]));
            batch.update(temp_sov_ref, {"pay_apps":temp_sov[i].pay_apps});//DONE
            rev_draw += Number(inputs[i]);
        }
 
        //UPDATE THIS_DRAW & BALANCE IN THE CONTRACT_INFO 
        let balance = Number(contract_info.base_contract_value) + Number(contract_info.co_value) - Number(contract_info.prev_draws) - rev_draw;
        batch.update(contract_ref, {"balance":balance});//DONE
        batch.update(contract_ref, {"this_draw":rev_draw});//DONE

        //RECENT TASKS
        let temp_update = [...contract_info.update];
        temp_update.push(new Date); 
        let temp_tasks = [...contract_info.recent_task];
        temp_tasks.push("Edited the most recent payment application")
        if(temp_update.length > 10){ //CAN'T EXCEED FIVE ITEMS
            temp_update.shift();
            temp_tasks.shift();
        }
        batch.update(contract_ref, {"update":temp_update}); //DONE
        batch.update(contract_ref, {"recent_task":temp_tasks}); //DONE

        
        batch.commit().then(()=>{
            console.log("updated app changes successfully"); 
            alert("Changes to most recent application updated successfully!"); 
            window.location.reload(false);
        })
        .catch((error) => {
            console.error("Error updating payment applicaiton", error); 
            alert("Failed to submit changes to the payment application. Please try again later or contact support.")
        });

    }

    const delete_pay_app = () => {
        let batch = firestoreDB.batch(); 
        let contract_ref = firestoreDB.collection("contracts").doc(id);

        //UPDATE THE LAST INDEX OF EACH PAY APP IN THE SOV TO BE THE USER INPUTS
        let temp_sov = JSON.parse(JSON.stringify(sov)); //CREATE A DEEP COPY
        let app_dates = JSON.parse(JSON.stringify(contract_info.pay_app_dates)); //CREATE A DEEP COPY
        app_dates.pop(); 
        let this_draw = Number(0); 
        let prev_draw = Number(0); 
        let balance = Number(0); 
        
        for (let i=0; i<temp_sov.length; i++){
            temp_sov[i].pay_apps.pop(); //REMOVE THE LAST APP VALUE
            let temp_apps = temp_sov[i].pay_apps; 
            this_draw += Number(temp_apps[temp_apps.length-1]) //NEED TO TOTAL THE LAST APP VALUE
            
            //GENERATE BATCH ITEM FOR EACH SOV
            let temp_sov_ref = contract_ref.collection("sov").doc(temp_sov[i].id);
            batch.update(temp_sov_ref, {"pay_apps":temp_sov[i].pay_apps});//DONE
        }
        if(contract_info.app_count == 1){
            prev_draw = Number(0); 
            balance = Number(contract_info.base_contract_value) + Number(contract_info.co_value); 
            this_draw = Number(0); 
        }
        else{
            prev_draw = Number(contract_info.prev_draws) - Number(this_draw); 
            balance = Number(contract_info.base_contract_value) + Number(contract_info.co_value) - Number(this_draw) - Number(prev_draw); 
        }
        
        //UPDATE THIS_DRAW & BALANCE IN THE CONTRACT_INFO 
        batch.update(contract_ref, {"balance":balance});//DONE
        batch.update(contract_ref, {"this_draw":this_draw});//DONE
        batch.update(contract_ref, {"prev_draws":prev_draw});//DONE
        batch.update(contract_ref, {"update":new Date()}); //DONE
        batch.update(contract_ref, {"recent_task":"Deleted the most recent payment application"}); //DONE
        batch.update(contract_ref, {"app_count": Number(contract_info.app_count)-1}); 
        batch.update(contract_ref, {"pay_app_dates": app_dates}); 

        
        batch.commit().then(()=>{
            console.log("Payment application deleted successfully"); 
            alert("Payment application deleted successfully."); 
            window.location.reload(false);
        })
        .catch((error) => {
            console.error("Error deleting payment applicaiton", error); 
            alert("Failed to delete payment application. Please try again later or contact support.")
        });
    }


    const delete_co = (sov_id,index) =>{
        let batch = firestoreDB.batch(); 
        let contract_ref = firestoreDB.collection("contracts").doc(id);
        let sov_ref = contract_ref.collection("sov").doc(sov_id);
        let co_val = Number(0); 

        let co_list = [];
        for (let i=0; i<sov.length; i++){
            if(sov[i].id == sov_id){
                co_list = JSON.parse(JSON.stringify(sov[i].change_orders)); //CREATE DEEP COPY
                console.log('INDEX', index)
                co_val = co_list[index].value; 
                break;
            }
        }

        co_list.splice(index,1); 
        batch.update(sov_ref, {"change_orders":co_list});//DONE
        batch.update(contract_ref, {"co_value":Number(contract_info.co_value)-Number(co_val)}); //DONE
        batch.update(contract_ref, {"co_count":Number(contract_info.co_count)-Number(1)}); //DONE
        batch.update(contract_ref, {"balance":Number(contract_info.balance)-Number(co_val)}); //DONE
        batch.update(contract_ref, {"update":new Date()}); //DONE
        batch.update(contract_ref, {"recent_task":"Deleted a change order."}); //DONE


        batch.commit().then(()=>{
            console.log("Change Order deleted successfully"); 
            alert("Change order deleted successfully."); 
            window.location.reload(false);
        })
        .catch((error) => {
            console.error("Error deleting change order.", error); 
            alert("Failed to delete change order. Please try again later or contact support.")
        });
    }

    const currency = (val) =>{
        return(
            <CurrencyFormat 
            value={val}
            displayType={'text'} 
            thousandSeparator={true} 
            prefix={'$'} 
            fixedDecimalScale={true} 
            decimalScale={2}
            renderText={value => <>{value}</>} 
            />
            
  
        )
    }

    const [period_summary, set_period_summary] = useState([]);
    //BUILDS PAY PERIOD TOTALS    
    const build_table_data = () => {
        let temp_period_summary = []; 
    
        for (let i = 0; i<contract_info.app_count; i++){
            temp_period_summary.push(Period_totals(contract_info.base_contract_value,sov,i+1,contract_info.retention));
        }
        console.log('SUMMARY', temp_period_summary)
        set_period_summary(temp_period_summary); 
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
                <h3>Base Contract: </h3> 
                {currency(contract_info.base_contract_value)}
   
                <h3>Change Orders: </h3> 
                {currency(contract_info.co_value)}
           
                <h3>Contract Total: </h3> 
                {currency(Number(contract_info.base_contract_value)+Number(contract_info.co_value))} 
            
                <h3> 
                    Payment Applications Completed: 
                </h3>
                {contract_info.app_count}
                <h3> 
                    Your next application is due: 
                </h3>
                {deadlines.days == 1 ? 'tomorrow': null} {deadlines.days ==0 ? 'today' : null} {deadlines.days >1 ? 'in '+ deadlines.days : null} {deadlines.days > 1 ? 'days': null} {deadlines.days < 0 ? deadlines.next_date : null}
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
                    <Change_order_table sov={sov} contract_info={contract_info} delete_co={delete_co}/> 
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
                    <Pay_app_table id={id} period_summary={period_summary} contract_info={contract_info} sov={sov} set_pay_app_id={set_pay_app_id} open_modal={()=>set_pay_modal_open(true)}/> 
                </Paper>
            ); 
        }
    }

    const chart_contract = () => {
        const data = []
        data.push({ key: 'Base Contract ($)', data: contract_info.base_contract_value });
        data.push({ key: 'Change Orders ($)', data: contract_info.co_value });


        return (
            <>
                <PieChart
                    width={450}
                    height={350}
                    data={data}
                    series={<PieArcSeries cornerRadius={4} padAngle={0.02} padRadius={200} doughnut={true} colorScheme={"cybertron"} />}
                />
            </>
        );

    }

    const [deadlines, set_deadlines] = useState({}); 
    const get_deadlines = (due_date) => {
        /*
        ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th",
        "13th","14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th",
        "27th", "28th", "Last"]; 
        */
        let temp_date = due_date;
        let due = new Date; 
        if(temp_date === "Last"){
            due = new Date((new Date).getFullYear(),(new Date).getMonth()+1,0);
        }
        else{
            temp_date = temp_date.slice(0, temp_date.length-2); 
            due = new Date((new Date).getFullYear(), (new Date).getMonth(),temp_date);
        }

        let remaining_days = due - new Date; 
        remaining_days = Number(remaining_days)/Number(86400000);
        remaining_days = Number(remaining_days.toFixed(0))+1;

        let next_date = new Date(due); 
        next_date.setMonth(next_date.getMonth()+1);



        //set_deadlines({days:remaining_days, date:Date_string(due)});
        
        //set_deadlines({days:remaining_days, date:Date_string(due)});
        return {days:remaining_days, date:Date_string(due), next_date:Date_string(next_date) }

    }

    const chart_draws = () => {
        const data = []
        data.push({ key: 'Open Balance ($)', data: contract_info.balance });
        data.push({ key: 'Billed ($)', data: Number(contract_info.base_contract_value) + Number(contract_info.co_value) - Number(contract_info.balance) }); 
               
        return (
            <>
                <PieChart
                    width={450}
                    height={350}
                    data={data}
                    
                    series={<PieArcSeries cornerRadius={4} padAngle={0.02} padRadius={200} doughnut={true} colorScheme={"cybertron"} />}
                />
            </>
        );

    }

    const recent_activity = () =>{
        //TODO

        return(
            <>
                <h3> Activity Log</h3>
            
            </>

        )



    }

    
    return (
        <>

            <Grid container spacing={2}>
                <Grid item xs = {6}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {job_info()}
                        </Grid>
                        <Grid item xs={6}>
                            {loading ? <CircularProgress/> : job_summary()}
                        </Grid>

                    </Grid>
                </Grid>


                <Grid item xs = {3}>
                    <Paper>
                        <h3>Billing</h3>
                        {loading ? <CircularProgress/> : chart_draws()}
                    </Paper> 
                    
                </Grid>
                <Grid item xs = {3}>
                    <Paper> 
                        <h3>Recent Billing</h3>
                        {loading? <CircularProgress/> : <Bar_chart data={period_summary} key_name={'cur_draw'} dates={contract_info.pay_app_dates}/>}
                    </Paper> 
               
                    

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
            {tab==2 ? <Paper>   <Button startIcon= {<AddCircleIcon/>} variant="contained" onClick={()=> set_co_modal_open(true)}> Add Change Order </Button><br/>  {change_orders()} </Paper>  : <></>  }
            
            

    

            <Modal open={co_modal_open} onClose={()=>set_co_modal_open(false)}  >
                {loading? <Paper> <CircularProgress/> </Paper> : <Change_order_modal contract_info={contract_info} sov_data={sov} close_modal={()=>set_co_modal_open(false)} submit={submit_co}/> }
            </Modal>
            <Modal open={pay_modal_open} onClose={()=>set_pay_modal_open(false)}  >
                {
                    loading ? 
                    <Paper> <CircularProgress/> </Paper> 
                    : 
                    <Pay_app_modal 
                        pay_app_id={pay_app_id} 
                        contract_info={contract_info} 
                        sov_data={sov}  
                        close_modal={()=>set_pay_modal_open(false)} 
                        submit={submit_app_changes}
                        delete_pay_app={delete_pay_app}
                    /> }
            </Modal>

        </>
  
    )
}

export default Contract_page
