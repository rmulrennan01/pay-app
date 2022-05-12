import React, {useEffect, useState} from 'react';

import firebase from "./Firebase.js"; 

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';

import Paper from '@mui/material/Paper';





function Contract_browser() {

    const [contracts, set_contracts] = useState([]); 
    const [loading, set_loading] = useState([]); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [page, set_page] = useState(0); 
    const [row_count, set_row_count] = useState(5); 




    React.useEffect( () => {
        const fetchData = async () =>{
        const dataList = await firestoreDB.collection("contracts").get(); //updated
        set_contracts(dataList.docs.map(doc=>doc.data())); 
        set_loading(false); 
        }
        fetchData(); 
    }, []);


    const build_table_body = (item,index) => {
        if(index >= row_count*page && index <= row_count*page+row_count-1){
        return(
            <TableRow key={index}> 
                <TableCell>
                    {item.name}
                </TableCell>
                <TableCell>
                    {item.address_01}
                </TableCell>
                <TableCell>
                    {item.city}
                </TableCell>
                <TableCell>
                    {item.state}
                </TableCell>
                <TableCell>
                    {item.owner.name}
                </TableCell>

            </TableRow>
        );
        }
    }

    const change_page = (event: unknown, new_page: number) => {
        set_page(new_page); 
    }

    const change_row_count = (event: React.ChangeEvent<HTMLInputElement>) => {
        set_row_count(parseInt(event.target.value, 10)); 
        set_page(0); 

    }




    



    return (
        <Paper>
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
                            City
                        </TableCell>
                        <TableCell>
                            State
                        </TableCell>
                        <TableCell>
                            Owner
                        </TableCell>
  
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contracts.map(build_table_body)}
        
                </TableBody>
            </Table>

        </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20]}
                component="div"
                count={contracts.length}
                rowsPerPage={row_count}
                page={page}
                onPageChange={change_page}
                onRowsPerPageChange={change_row_count}
            />
        </Paper>
    )
}

export default Contract_browser
