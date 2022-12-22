import React, {useState, useEffect} from 'react';
import "./Home.css"

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

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

    const display = (item, index) => {
        return(
            <>
                {item.hasOwnProperty("update") ? item.update.toDate().toString() : null}
                <br></br>
            </>

        )

    }



    return (
        <div>
            <Paper className="home__info__tile"> 
                Welcome to the payment application manager. Here you can manage all of your payment applications without the need
                of all those pesky spreadsheets. 
            </Paper>
            <br/><br/><br/>
            <Paper>
                <h3>Recent Activity</h3>
                {loading ? null : contracts.map(display)}

            </Paper>
           {loading ? null : console.log(contracts)}
           {loading ? null : console.log(contracts[0].update.toDate())}
           
           

            <Button variant="contained">Setup a new project</Button>
        </div>
    )
}

export default Home
