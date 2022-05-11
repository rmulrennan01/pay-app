import React, {useEffect, useState} from 'react';

import firebase from "./Firebase.js"; 

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Paper from '@mui/material/Paper';





function Contract_browser() {

    const [contracts, set_contracts] = useState([]); 
    const [loading, set_loading] = useState([]); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 




    React.useEffect( () => {
        const fetchData = async () =>{
        const dataList = await firestoreDB.collection("contracts").get(); //updated
        set_contracts(dataList.docs.map(doc=>doc.data())); 
        set_loading(false); 
        }
        fetchData(); 
    }, []);


    const build_table_body = (item,index) => {
        return(
            <TableRow key={index}> 
                <TableCell>
                    {item.name}
                </TableCell>
                <TableCell>
                    {item.address_01}
                    
                </TableCell>
                <TableCell>
                    {item.value}
                </TableCell>

            </TableRow>
        );
}




    



    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        <TableCell>
                            Project
                        </TableCell>
                        <TableCell>
                            Address
                        </TableCell>
                        <TableCell>
                            Value ($)
                        </TableCell>
  
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contracts.map(build_table_body)}
        
                </TableBody>
            </Table>

        </TableContainer>
    )
}

export default Contract_browser
