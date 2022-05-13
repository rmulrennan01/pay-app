import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import firebase from "./Firebase.js"; 
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

function Contract_page(props) {
    const [contract_info, set_contract_info] = useState([]); 
    const [loading, set_loading] = useState([]); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const {id} = useParams(); 
   



    //fetch the document from firebase
    React.useEffect( () => {
        const fetchData = async () =>{
        const dataList = await firestoreDB.collection("contracts").doc(id).get(); //updated
        //set_contract_info(dataList.docs.map(doc=>doc.data())); 
        set_contract_info(dataList.data()); 
        set_loading(false); 
       
        }
        fetchData(); 
        console.log(contract_info); 
        
    }, []);



    


    return (
        <div>

            Contract: <br/> 
            {contract_info.name} <br/>
            {contract_info.address_01} <br/>
            {contract_info.address_02} <br/>
            {contract_info.city}, {contract_info.state} {contract_info.zip}
            <br/> <br/> 
            Owner: <br/> 
            {console.log(contract_info.owner)}
            
            
        </div>
    )
}

export default Contract_page
