import React, {useState, useEffect} from 'react';
import "./Home.css"

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
import Bar_chart from './Utilities/Bar_chart.js'; 

import firebase from "./Firebase.js"; 

function Home() {
    const [contracts, set_contracts] = useState([]); 
    const [loading, set_loading] = useState(true);     
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 


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
            set_loading(false);         
    
             
        }

        const fetchData = async () =>{
            const dataList = await firestoreDB.collection("contracts").get(); //updated
            dataList.docs.map(build_data);

        }
        fetchData(); 
        
    }, []);

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

        let remaining_days = due - new Date; 
        remaining_days = Number(remaining_days)/Number(86400000);
        remaining_days = Number(remaining_days.toFixed(0))+1;

        //return {days:remaining_days, date:Date_string(due)}
        return {days:remaining_days, date:Date_string(due)}; 
    }

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
        if(index < 10 && item.hasOwnProperty("update") && item.hasOwnProperty("recent_task")){
            return(
                <TableRow key={index+"recent"}  onClick={()=>window.location='/contract/'+ String(item.id)} className="home__row">
                    <TableCell className="home__data">
                        {item.name}
                    </TableCell>
                    <TableCell className="home__data">
                        {item.recent_task}
                    </TableCell>
                    <TableCell className="home__data">
                        {item.hasOwnProperty("update") ? item.update.toDate().toString() : null}
                    </TableCell>
                </TableRow>

            )
        }
    }

    const display_due_dates = (item,index) => {
        return(
            <TableRow key={index+"due"}  onClick={()=>window.location='/contract/'+ String(item.id)} className="home__row">
                <TableCell> {item.name} </TableCell>
                <TableCell> {item.date} </TableCell>
                <TableCell> {item.days} </TableCell>
            </TableRow>
        )
    }



    return (
        <div>
            <br></br>
            <Button variant="contained">Setup a new project</Button>
            <Paper>

            </Paper>

            <Paper>
                <h3>Recent Project Activity</h3>
                <Paper>
                <Table>
                    <TableRow>
                        <TableCell className="home__data"> <h3>Project</h3></TableCell>
                        <TableCell className="home__data"> <h3>Task</h3></TableCell>
                        <TableCell className="home__data"> <h3>Date</h3></TableCell>
                    </TableRow>
                    <TableBody>
                        {loading ? <CircularProgress /> : contracts.map(display_tasks)}
                    </TableBody>
                </Table>
                </Paper>
            </Paper>

            <Paper>
                <h3>Upcoming Applications Due</h3>
                <Paper>
                <Table>
                    <TableRow>
                        <TableCell className="home__data"> <h3>Project</h3></TableCell>
                        <TableCell className="home__data"> <h3>Due Date</h3></TableCell>
                        <TableCell className="home__data"> <h3>Days Remaining</h3></TableCell>
                    </TableRow>
                    <TableBody>
                        {loading ? <CircularProgress /> : upcoming_apps.map(display_due_dates)}
                    </TableBody>
                </Table>
                </Paper>
            </Paper>
            <Paper>
                <Bar_chart />
            </Paper>


           {loading ? null : console.log(contracts)}
           {loading ? null : console.log(contracts[0].update.toDate())}
           
           

        </div>
    )
}

export default Home
