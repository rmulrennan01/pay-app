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
import { BarChart, BarSeries, Bar } from 'reaviz';
import Grid from '@mui/material/Grid';

import firebase from "./Firebase.js"; 

function Home() {
    const [contracts, set_contracts] = useState([]); 
    const [loading, set_loading] = useState(true);     
    const [draws, set_draws] = useState({}); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 

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
            get_tasks(temp_array); 
            set_loading(false);         
    
             
        }

        const fetchData = async () =>{

            //const dataList = await firestoreDB.collection("contracts").get(); //updated
            let job_ref = firestoreDB.collection('jobs').doc(uid).collection('contracts');
            //let owner_ref = firestoreDB.collection('contacts').doc(uid).collection('owners'); 
            const dataList = await job_ref.get();
            dataList.docs.map(build_data);
            let account_ref = firebase.firestore().collection('accounts').doc(uid); 
            const account = await account_ref.get();
            set_draws(account.data().draws);

        }
        //if(uid != 0){
            console.log('USER', uid); 
            fetchData(); 
        //}
        
    }, [uid]);

  

 

    /*
    useEffect(() => {
        sort_dates(contracts); 
        set_loading(false);         

    }, [contracts])
    */

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

    const pie_chart = (data) => {
        return(
        <PieChart
            width={450}
            height={350}
            data={data}
            series={<PieArcSeries cornerRadius={4} padAngle={0.02} padRadius={200} doughnut={true} colorScheme={"cybertron"} />}
        />
        )
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
        if(index < 10){
            return(
                <Tooltip title='Go to Contract' arrow>

                <TableRow key={index+"recent"}  onClick={()=>window.location='/contract/'+ String(item.id)} className="home__row">
                    <TableCell className="home__data">
                        {item.name}
                    </TableCell>
                    <TableCell className="home__data">
                        {item.recent_task}
                    </TableCell>
                    <TableCell className="home__data">
                        {item.date.toDate().toString()}
                    </TableCell>
                </TableRow>
                </Tooltip>
            )
        }
    }
    


    //HELPER FUNCTION TO BUILD A LIST OF RECENT TASKS THAT WILL BE DISPLAYED
    const [task_list, set_task_list] = useState([]); 
    const get_tasks = (contract_list) => {
        let tasks = []; 
        for (let i = 0; i< contract_list.length; i++){
            for (let k = 0; k < contract_list[i].recent_task.length; k++){
                let temp = {}
                temp.recent_task = contract_list[i].recent_task[k]; 
                temp.date = contract_list[i].update[k]; 
                temp.id = contract_list[i].id;    
                temp.name = contract_list[i].name;  
                tasks.push(temp);      
            }
        }
        //SORT
        tasks = tasks.sort(function(a,b){
            let x = a["date"];
            let y = b["date"];
            if (x<y){
                return -1;
            }
            if (x>y){
                return 1; 
            }
            
        return 0;
        });
        set_task_list(tasks); 
    }



    const display_due_dates = (item,index) => {
        return(
            <Tooltip title='Go to Contract' arrow>
            <TableRow key={index+"due"}  onClick={()=>window.location='/contract/'+ String(item.id)} className="home__row">
                <TableCell> {item.name} </TableCell>
                <TableCell> {item.date} </TableCell>
                <TableCell> {item.days} </TableCell>
            </TableRow>
            </Tooltip>
        )
    }


    const bar_chart = () => {
        let today = new Date(); 
        let prev_mo_1 = new Date(today.getFullYear(),today.getMonth()-1);
        let prev_mo_2 = new Date(prev_mo_1.getFullYear(),prev_mo_1.getMonth()-1);
        let prev_mo_3 = new Date(prev_mo_2.getFullYear(),prev_mo_2.getMonth()-1);

        let date_keys = [
            String(today.getMonth()) + '/' + String(today.getFullYear()),
            String(prev_mo_1.getMonth()) + '/' + String(prev_mo_1.getFullYear()),
            String(prev_mo_2.getMonth()) + '/' + String(prev_mo_2.getFullYear()),
            String(prev_mo_3.getMonth()) + '/' + String(prev_mo_3.getFullYear())
        ]

        let result = []
        date_keys.map( (item) =>{
            if(draws[item] != undefined){
                result.push(draws[item])
            }
            else{
                result.push(Number(0)); 
            }
        }); 
        console.log('draws', draws)
        console.log('result', result); 
        


        let data=[
            { key: prev_mo_3.toDateString().split(" ")[1] + ' ($)', data: result[0]},
            { key: prev_mo_2.toDateString().split(" ")[1] + ' ($)', data: result[1] },
            { key: prev_mo_1.toDateString().split(" ")[1] + ' ($)', data: result[2]},
            { key: today.toDateString().split(" ")[1] + ' ($)', data: result[3] }
          ]; 
    
        
    
        return (
          <BarChart
            width={400}
            height={350}
            data={data}
            series={
              <BarSeries
                colorScheme={'cybertron'}
                padding={0.1}
              
              />
            }
          />
        );
    }





    return (

        <div style={{margin:"15px"}}>
            <br></br>
            <Button variant="contained">Setup a new project</Button>
            <Grid container spacing={2} sx={{height:550}}>
                <Grid item xs = {3} sx={{height:550}}>
                    <Paper elevation={8} sx={{height:550}}>
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
                                    {loading ? <CircularProgress /> : task_list.map(display_tasks)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </Paper>
                    </Paper>
                </Grid>
                <Grid item xs = {3} sx={{height:550}}>
                    <Paper elevation={8} sx={{height:550}}>
                        <h3>Upcoming Applications Due</h3>
                        <TableContainer style={{maxHeight:500}}>

                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="home__data"> <h3>Project</h3></TableCell>
                                        <TableCell className="home__data"> <h3>Due Date</h3></TableCell>
                                        <TableCell className="home__data"> <h3>Days Remaining</h3></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? <CircularProgress /> : upcoming_apps.map(display_due_dates)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs = {3} sx={{height:550}}>
                    <Paper elevation={8} sx={{height:550}}>
                        <h3>Recent Billing</h3>
                        {bar_chart()}
                    </Paper>
                </Grid>
            </Grid>

        </div>
    );
}

export default Home
