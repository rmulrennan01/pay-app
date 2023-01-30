import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { PieChart, PieArcSeries, PieArcLabel } from 'reaviz';
import Date_string from './Utilities/Date_string.js'; 
import Bar_chart from './Utilities/Bar_chart.js'; 
import Period_totals from './Utilities/Period_totals';
import Divider from '@mui/material/Divider';

//AUTH
import {useContext} from 'react'; 
import { UserContext } from "./User_provider";

//CUSTOM DATABASE UTILITIES
import Activity_update from './Database_util/Activity_update.js'
import Edit_app from './Database_util/Edit_app.js'
import Delete_app from './Database_util/Delete_app.js'
import Add_co from './Database_util/Add_co.js'; 
import Delete_co from './Database_util/Delete_co.js'; 

import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Grid from '@mui/material/Grid';
import Contract_sov from "./Contract_page/Contract_sov.js"; 
import Change_order_modal from './Contract_page/Change_order_modal.js';
import Change_order_table from './Contract_page/Change_order_table.js'; 
import Pay_app_table from './Contract_page/Pay_app_table.js'; 
import Pay_app_modal from './Contract_page/Pay_app_modal.js'; 

import CurrencyFormat from 'react-currency-format';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import AddCircleIcon from '@mui/icons-material/AddCircle'; 

import Box from '@mui/material/Box';

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
    const [account, set_account] = useState(); 

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

    //FETCH THE CONTRACT AND OWNER INFO FROM THE DATABASE -> PULL ID FROM USEPARAMS()
    useEffect( () => {
        const fetchData = async () =>{
            let job_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts');
            let owner_ref = firestoreDB.collection('contacts').doc(uid).collection('owners'); 
            //const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
            const dataList = await job_ref.doc(id).get(); //updated
            set_contract_info(dataList.data()); 
            set_deadlines(get_deadlines(dataList.data().due_date))

           
        
            //const dataList2 = await firestoreDB.collection("owners").doc(dataList.data().owner_id).get(); //updated
            const dataList2 = await owner_ref.doc(dataList.data().owner_id).get(); 
            set_owner_info(dataList2.data()); 

            const tempList = []; 

            //const dataList3 = await firestoreDB.collection("contracts").doc(id).collection("sov").get();
            const dataList3 = await job_ref.doc(id).collection("sov").get();
            dataList3.forEach((doc) => {
                let tempDict = doc.data(); 
                tempDict["id"] = doc.id; 
                tempList.push(tempDict); 
            });
            set_sov(tempList); 
            set_loading(false); 
        }
        fetchData(); 
    }, [uid]);  


    useEffect( () => {
        build_table_data();
        get_activities();
    }, [contract_info, sov]); 


    //CALLS DATABASE UTILITY FUNCTION TO SUBMIT THE NEW CHANGE ORDER
    const submit_co = (sov_id, data) => {
        Add_co(sov_id,data,contract_info,uid,id); 
    }

    //CALLS DATABASE UTILITY FUNCTION TO POST CHANGES FROM EDITING THE MOST RECENT PAY APP
    const submit_app_changes = (inputs) => {
        Edit_app(inputs, contract_info, sov, uid, id); 
    }

    //CALLS DATABASE UTILITY FUNCTION TO REMOVE THE MOST RECENT PAY APP
    const delete_pay_app = () =>{
        Delete_app(contract_info, sov, uid, id); 

    }

    //CALLS DATABASE UTILITY FUNCTION TO DELETE THE CHANGE ORDER OF A SPECIFIC INDEX
    const delete_co = (sov_id,index) =>{
        Delete_co(contract_info, sov, sov_id, index, uid, id);
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

        return(

            <Grid container spacing={2}>
                <Grid item xs = {6} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <h3>  Contract: </h3>  
                            {contract_info.name} <br/>
                            {contract_info.address_01} <br/>
                            {contract_info.address_02!=""? <>{contract_info.address_02} <br/> </>:<></>}
                            {contract_info.city}, {contract_info.state} {contract_info.zip}

                        </Grid>
                        <Grid item xs={12} >
                            <h3> Owner: </h3> 
                            {owner_info.name} <br/>
                            {owner_info.address_01} <br/>
                            {owner_info.address_02!=""? <>{owner_info.address_02} <br/> </>:<></>}
                            
                            {owner_info.city}, {owner_info.state} {owner_info.zip}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <h3>Base Contract: </h3> 
                    {currency(contract_info.base_contract_value)}
    
                    <h3>Change Orders: </h3> 
                    {currency(contract_info.co_value)}
            
                    <h3>Contract Total: </h3> 
                    {currency(Number(contract_info.base_contract_value)+Number(contract_info.co_value))} 

                </Grid>
            </Grid>

        ); 

        
    }

    
    //BOTTOM TAB FOR SOV
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
    
    //BOTTOM TAB FOR CHANGE ORDERS
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

    //BUTTOM TAB FOR PAY APPS
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



    //CONSTRUCTS AN ARRAY OF JSON OBJECTS TO BE USED FOR MAP FUNCTION TO RENDER TASK LIST
    const [activity_list, set_activity_list] = useState([]); 
    const get_activities = () =>{
        console.log('RAN', contract_info); 
        let data = [];
        if(contract_info.length != 0){
            console.log('ran 2'); 
            for (let i = 0; i<contract_info.update.length; i++){
                data.push({description:contract_info.recent_task[i], date:Date_string(contract_info.update[i])})
            }
        }
        data.reverse();
        set_activity_list(data); 
    }


    const recent_task_table = (item) => {
        console.log('TEXT', item); 
        return(
            <TableRow >
                <TableCell>
                    {item.description}
                </TableCell>
                <TableCell>
                    {item.date}
                </TableCell>
            </TableRow>
        )
    }


    const [deadlines, set_deadlines] = useState({}); 
    const get_deadlines = (due_date) => {
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
        return {days:remaining_days, date:Date_string(due), next_date:Date_string(next_date) }
    }

    const chart_draws = () => {
        const data = []
        data.push({ key: 'Open Balance ($)', data: contract_info.balance });
        data.push({ key: 'Billed ($)', data: Number(contract_info.base_contract_value) + Number(contract_info.co_value) - Number(contract_info.balance) }); 
        return (
            <Grid container spacing={0} >
                <Grid item xs = {12}  >                        
                    {circle_chart()}
                </Grid>
                <Grid item xs = {12} >
                   
                    <h3> 
                        Payment Applications Completed:  {contract_info.app_count}
                    </h3>
                    
                    <h3> 
                        Your next application is due: {deadlines.days == 1 ? 'Tomorrow': null} {deadlines.days ==0 ? 'Today' : null} {deadlines.days >1 ? 'in '+ deadlines.days : null} {deadlines.days > 1 ? 'days': null} {deadlines.days < 0 ? deadlines.next_date : null}
                    </h3>
                    
                
                </Grid>
            </Grid>
        );
    }

    const circle_chart = () =>{
        const data = []
        data.push({ key: 'Open Balance ($)', data: contract_info.balance });
        data.push({ key: 'Billed ($)', data: Number(contract_info.base_contract_value) + Number(contract_info.co_value) - Number(contract_info.balance) }); 
               
    
        return (
          <div
            style={{
              position: 'relative',
              height: '300px',
              width: '500px',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <PieChart
                width={500}
                height={300}
                data={data}
                series={
                  <PieArcSeries doughnut={true} colorScheme={'cybertron'} />
                }
              />
            </div>
            <h2 style={{ margin: '0 5px', padding: 0, color: 'black' }}>
                {(100-(Number(contract_info.balance)/(Number(contract_info.base_contract_value)+Number(contract_info.co_value))*100)).toFixed(2)}%
            </h2>
          </div>
        );
    }

    const recent_activity = () =>{
        return(
            <TableContainer style={{maxHeight:400}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <h3> Task </h3>
                            </TableCell>
                            <TableCell>
                                <h3>Date</h3>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activity_list.map(recent_task_table)} 
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    
    return (
        <div style={{margin:"15px"}}>

            <Grid container spacing={2} sx={{height:500}}>
                <Grid item xs = {3} sx={{height:'100%'}}>
                    <Paper elevation={8} sx={{height:'100%', padding:2}}>
                        <h2>Project Summary</h2>
                        {loading ? <CircularProgress/> : job_info()}
                    </Paper>

                </Grid>

                <Grid item xs = {3} sx={{height:'100%'}}>
                    <Paper elevation={8} sx={{height:'100%', padding:2}}>
                        <h2>Billing Progress</h2>
                        {loading ? <CircularProgress/> : chart_draws()}
                    </Paper> 
                    
                </Grid>
                <Grid item xs = {3} sx={{height:'100%'}}>
                    <Paper elevation={8} sx={{height:'100%', padding:2}}> 
                        <h2>Recent Applications for Payment</h2>
                        {loading? <CircularProgress/> : <Bar_chart data={period_summary} key_name={'cur_draw'} dates={contract_info.pay_app_dates}/>}
                    </Paper> 
               
                </Grid>
                <Grid item xs = {3} sx={{height:'100%'}}>
                    <Paper elevation={8} sx={{height:'100%', padding:2}}>
                        <h2>Recent Activity</h2>
                        {loading? <CircularProgress/> : recent_activity()}
                    </Paper>
                </Grid>



            </Grid>

 
            <br/> 
            <br/>
            <Paper elevation={8} >
                <Tabs value={tab}  centered>
                    <Tab label={<Button endIcon={<AttachMoneyIcon/>}><h3>Payment Applications</h3></Button>} onClick={()=>set_tab(0)}/>   
                    <Tab label={<Button endIcon={<ReceiptLongIcon/>}><h3>Schedule of Values</h3> </Button>} onClick={()=>set_tab(1)}/>
                    <Tab label={<Button endIcon={<CurrencyExchangeIcon/>}><h3>Change Orders</h3></Button>} onClick={()=>set_tab(2)}/>
                    
                </Tabs>
                <Divider />
                
                {tab==0 ?    pay_apps() : <></>  }
                {tab==1 ? job_sov()  : <></>  }
                {tab==2 ? <><Button startIcon= {<AddCircleIcon/>} variant="contained" onClick={()=> set_co_modal_open(true)}> Add Change Order </Button> {change_orders()} </>  : <></>  }
            </Paper>
            

    

                <Modal open={co_modal_open} onClose={()=>set_co_modal_open(false) } >

                    {loading? 
                    <Paper> <CircularProgress/> </Paper> 
                    : 
           
                    <Change_order_modal 
                        contract_info={contract_info} 
                        sov_data={sov} 
                        close_modal={()=>set_co_modal_open(false)} 
                        submit={submit_co}
                        onClose={()=>set_co_modal_open(false)}/> 
                  
                        }
  
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

        </div>
  
    )
}

export default Contract_page
