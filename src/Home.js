import React, {useState, useEffect} from 'react';
import "./Home.css"

//AUTH
import {useContext} from 'react'; 
import { UserContext } from "./User_provider";

import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { PieChart, PieArcSeries } from 'reaviz';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Date_string from './Utilities/Date_string.js'; 
import { BarChart, BarSeries, Bar, GridlineSeries, Gridline } from 'reaviz';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import firebase from "./Firebase.js"; 
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Home() {
    const [contracts, set_contracts] = useState([]); 
    const [loading, set_loading] = useState(true);     
    const [draws, set_draws] = useState({}); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [totals, set_totals] = useState({}); 
    const [activity, set_activity] = useState([]);

    //auth
    const user = useContext(UserContext);
    const [uid, set_uid] = useState(0); 
    



    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('signed in', user.uid);
            set_uid(user.uid); 

        } else {
            console.log('signed out', user);
            window.location='/login/';
        }
    });



    

    useEffect( () => {
        //map document id's with the local data -> needed for creating links
        const build_data = (item, index) => {
            let temp_dict = item.data();
            temp_dict['id'] = item.id; 
            
            let temp_array = contracts; 
            temp_array.push(temp_dict); 
            set_contracts(temp_array); 
            sort_dates(contracts); 
            build_deadlines();
            build_contract_totals(); 
            set_loading(false);         
    
             
        }

        const fetchData = async () =>{

            //RETRIEVE CONTRACT INFO
            let job_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts');
            const dataList = await job_ref.get();
            dataList.docs.map(build_data);

            let account_ref = firebase.firestore().collection('accounts').doc(uid); 
            const account = await account_ref.get();
            set_draws(account.data().draws);
            set_activity(account.data().activity.reverse());

        }
        //if(uid != 0){
            console.log('USER', uid); 
            fetchData(); 
        //}
        
    }, [uid]);

  


    const sort_dates = () => {
        let temp_contracts = contracts;
        temp_contracts = temp_contracts.sort(function(a,b){
            if(a.hasOwnProperty("update") && b.hasOwnProperty("update")){
                let x = a["update"];
                let y = b["update"];
                if (x>y){
                    return -1;
                }
                if (x<y){
                    return 1; 
                }
                }
            return 0;
            
        }
        )
        set_contracts(temp_contracts); 
    }



    //RETURNS REMAINING DAYS UNTIL THE SUPPLIED DUE_DATE
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

        let today = new Date; 
        let remaining_days = due - today;  

        if(due.getDay() == today.getDay()){
            remaining_days = Number(0); 
            due = today; 
        }
        else if(remaining_days < 0){
            due.setMonth(due.getMonth()+1); 
            remaining_days = due - new Date; 
            remaining_days = Number(remaining_days)/Number(86400000);
            remaining_days = Number(remaining_days.toFixed(0))+1;

        }
        else{
            remaining_days = due - new Date;
            remaining_days = Number(remaining_days)/Number(86400000);
            remaining_days = Number(remaining_days.toFixed(0))+1;

        }

        //return {days:remaining_days, date:Date_string(due)}
        return {days:remaining_days, date:Date_string(due)}; 
    }

    //HELPER FUNCTION TO CREATE AN ARRAY OF UPCOMING DEADLINES FOR ALL CONTRACTS.
    const [upcoming_apps, set_upcoming_apps] = useState([]); 
    const build_deadlines = () => {
        let upcoming = [];
        contracts.map( (item,index)=>{
            let deadline = get_deadlines(item.due_date); 
            upcoming.push(
            {
                name: item.name,
                days: deadline.days,
                id: item.id,
                date: deadline.date
            }
            )
        })
        //SORT DAYS
        upcoming = upcoming.sort(function(a,b){
                let x = a["days"];
                let y = b["days"];
                if (x<y){
                    return -1;
                }
                if (x>y){
                    return 1; 
                }
                
            return 0;
        }
        )   
        set_upcoming_apps(upcoming); 
    }

    
    //BUILDS TASKS TABLE
    const display_tasks = (item, index) => {
        if(index < 30){
            let date = new Date(item.date.seconds*1000);
            console.log('task', item); 
            return(
                <Tooltip title='Go to Contract' arrow>

                <TableRow key={index+"recent"}  onClick={()=>window.location='/contract/'+ String(item.contract_id)} className="home__row">
                    <TableCell className="home__data">
                        {item.contract_name}
                    </TableCell>
                    <TableCell className="home__data">
                        {item.activity}
                    </TableCell>
                    <TableCell className="home__data">
                        {String(date)}
                    </TableCell>
                </TableRow>
                </Tooltip>
            )
        }
    }
    



    const display_due_dates = (item,index) => {
        return(
            <Tooltip title='Go to Contract' arrow>
            <TableRow key={index+"due"} className="home__row">
                <TableCell  onClick={()=>window.location='/contract/'+ String(item.id)} > {item.name} </TableCell>
                <TableCell  onClick={()=>window.location='/contract/'+ String(item.id)} > {item.date} </TableCell>
                <TableCell  onClick={()=>window.location='/contract/'+ String(item.id)} > {item.days} </TableCell>
                <TableCell>
                    <Tooltip title="Start Application" color='primary'>
                        <IconButton onClick={()=>window.location='/pay_app/'+ String(item.id)} sx={{zIndex:1200}}>

                                <ArrowForwardIcon />
                            
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            </Tooltip>
        )
    }


    const bar_chart = () => {
        let temp_date = new Date(); 
        let date_keys = [];
        let data = []

        for (let i = 0; i<12; i++){
            if(i!=0){
                temp_date = new Date(temp_date.getFullYear(),temp_date.getMonth()-1);

            }
            let temp_string = String(temp_date.getMonth()) + '/' + String(temp_date.getFullYear())
            date_keys.push(temp_string);
            console.log('date_string', temp_string); 
            if(draws[temp_string] != undefined){
                data.push({ key: temp_date.toDateString().split(" ")[1] + ' ($)', data: Number(draws[temp_string])})
            }
            else{
                data.push({ key: temp_date.toDateString().split(" ")[1] + ' ($)', data: Number(0)})
            }
        }
 
        data.reverse();
          
        return (
        <div sx={{padding:5}}>
            <Grid container>
                <Grid item xs={.5} sx={{height:350}}>
                    <h4 className='home__graph_y_axis'>Total Draw Amount ($)</h4>
                </Grid>
                <Grid item xs={11.5}>
                    <BarChart
                        width={'auto'}
                        height={350}
                        data={data}
                        gridlines={<GridlineSeries line={<Gridline direction="y" />} />}
                        series={
                        <BarSeries
                            colorScheme={'cybertron'}
                            padding={0.1}
                        />
                        }
                    />
                </Grid>
                <Grid xs={12} item>
                    <h4 style={{width:'100%', textAlign: 'center'}}> Month of Application Submission</h4>
                </Grid>
                
            </Grid>
            
        </div>
        );
    }

    //BUILDS DATA TO BE USED IN CIRCLE CHART
    const build_contract_totals = () =>{
        let draws = Number(0); 
        let base_val = Number(0); 
        let co_val = Number(0); 
        for (let i=0; i<contracts.length; i++){
            draws += Number(contracts[i].prev_draws) + Number(contracts[i].this_draw)
            base_val += Number(contracts[i].base_contract_value);
            co_val += Number(contracts[i].co_value); 
        }

        let bal = base_val + co_val - draws;
        set_totals(
            [
                {key:'Base Contract ($)', data: base_val},
                {key:'Change Orders ($)', data: co_val},
                {key:'Draws ($)', data: draws},
                {key:'Balance ($)', data: bal}
            ]
        )
    }

    //
    const circle_chart = () =>{
        const data = totals;    
        return (
          <div
            style={{
              position: 'relative',
              height: 'auto',
              width: 'auto',
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

          </div>
        );
    }





    return (

        <div style={{padding:'25px', height: '1400px'}}>
            <br></br>
            <Button variant="contained" onClick={()=>window.location ="/job_setup" } >Setup a new project</Button>
            <Grid container spacing={3} rowSpacing={20} sx={{height:550}}>


                <Grid item xs = {4} sx={{height:550 , mt:'20px'}}>
                    <Paper elevation={8} sx={{height:550, padding:5}}>
                        <h3>Upcoming Applications Due</h3>
                        <TableContainer style={{maxHeight:400}}>

                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow >
                                        <TableCell className="home__data"> <h3>Project</h3></TableCell>
                                        <TableCell className="home__data"> <h3>Due Date</h3></TableCell>
                                        <TableCell className="home__data" sx={{width:20}}> <h3>Days Remaining</h3></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? <CircularProgress /> : upcoming_apps.map(display_due_dates)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs = {8} sx={{height:550, mt:'20px'}}>
                    <Paper elevation={8} sx={{height:550, padding:5}}>
                        <h3>Last 12 Months of Payment Applications</h3><br></br>
                        {bar_chart()}
                    </Paper>
                </Grid>
                <Grid item xs = {8} sx={{height:550, mt:'20px'}}>
                    <Paper elevation={8} sx={{height:550, padding:5, mt:10}}>
                        <h3>Recent Project Activity</h3>
                        <Paper>
                        <TableContainer style={{maxHeight:500}}>
                            <Table stickyHeader >
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="home__data"> <h3>Project</h3></TableCell>
                                        <TableCell className="home__data"> <h3>Task</h3></TableCell>
                                        <TableCell className="home__data"> <h3>Date</h3></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? <CircularProgress /> : activity.map(display_tasks)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </Paper>
                    </Paper>
                </Grid>
                <Grid item xs = {4} sx={{height:550, mt:'20px'}}>
                    <Paper elevation={8} sx={{height:550, padding:5, mt:10}}>
                        <h3>Contract Progress</h3>
                        {circle_chart()}
                    </Paper>
                </Grid>



            </Grid>

        </div>
    );
}

export default Home
