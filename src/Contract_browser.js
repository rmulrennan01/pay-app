import React, {useEffect, useState, useRef} from 'react';

import firebase from "./Firebase.js"; 
import "./Contract_browser.css"; 

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import TextField from '@mui/material/TextField';


import CircularProgress from '@mui/material/CircularProgress';

import CurrencyFormat from 'react-currency-format';



function Contract_browser() {

    const [contracts, set_contracts] = useState([]); 
    const [filtered_contracts, set_filtered_contracts] = useState([]); 
   
    const [loading, set_loading] = useState([]); 
    const [firestoreDB, setFirestoreDB] = useState(firebase.firestore()); 
    const [page, set_page] = useState(0); 
    const [row_count, set_row_count] = useState(20); 



    //fetch the contracts
    React.useEffect( () => {
        //map document id's with the local data -> needed for creating links
        const build_data = (item, index) => {
            let temp_dict = item.data();
            temp_dict['id'] = item.id; 
            
            let temp_array = contracts; 
            temp_array.push(temp_dict); 
            set_contracts(temp_array); 
            set_filtered_contracts(temp_array); 
        }

        const fetchData = async () =>{
            const dataList = await firestoreDB.collection("contracts").get(); //updated
            dataList.docs.map(build_data);
            set_loading(false); 
        }
        fetchData(); 
        
    }, []);


    const build_table_body = (item,index) => {
        if(index >= row_count*page && index <= row_count*page+row_count-1){
        return(
            <TableRow className="Contract_browser__row" key={index} onClick={()=>window.location='/contract/'+ String(item.id)} > 
            
                <TableCell>
                    <TableSortLabel
                      
                        
                        >
                        
                    </TableSortLabel>
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
                   {item.owner_name}
                </TableCell>
                <TableCell>
                   <CurrencyFormat value={item.base_contract_value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                </TableCell>
                <TableCell>
                    <CurrencyFormat value={item.co_value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                
                </TableCell>
                <TableCell>
                    <CurrencyFormat value={Number(item.co_value)+Number(item.base_contract_value)} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                
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



    const loading_indicator = () => {
        if(loading){
            return(
                <CircularProgress /> 
            )
        }
    }


    const filterRef = useRef(); 

    const filter = (search_str) => {
        let temp_array = []; 
        let str = search_str.toLowerCase(); 
        console.log(str); 
        
        
        contracts.map((item)=>{
            console.log(item.name); 

            
            if(
                item.name.toLowerCase().includes(str) || 
                item.address_01.toLowerCase().includes(str) || 
                item.address_02.toLowerCase().includes(str) ||
                item.owner_name.toLowerCase().includes(str) ||
                item.city.toLowerCase().includes(str) ||
                item.state.toLowerCase().includes(str)
            )
                {
                    temp_array.push(item); 
                }; 
            

        }); 
        set_filtered_contracts(temp_array); 
        


    }
    



    return (
        <Paper>
            <br/> 
        <Button variant="contained" href="/job_setup"> + Add a Contract </Button> 
        <br/> <br/> 
        <TextField 
                id="outlined-required" 
                label="Search" 
                inputRef={filterRef}
                defaultValue={""}
        />
        <Button variant="contained" onClick={()=>filter(filterRef.current.value)}> Go </Button> 
        <br/> <br/>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size={'small'}>
                <TableHead> 
                    <TableRow className="Contract_browser__header">
                        <TableCell className="Contract_browser__header_text">
                           <h3>  Project </h3> 
                        </TableCell>
                        <TableCell className="Contract_browser__header_text">
                            <h3> Address </h3> 
                        </TableCell>
                        <TableCell className="Contract_browser__header_text">
                            <h3> City </h3> 
                        </TableCell>
                        <TableCell className="Contract_browser__header_text">
                            <h3> State </h3> 
                        </TableCell>
                        <TableCell className="Contract_browser__header_text">
                        
                            <h3> Owner </h3> 
                        </TableCell>
                        <TableCell className="Contract_browser__header_text">
                        
                            <h3> Base Contract ($) </h3> 
                        </TableCell>
                        <TableCell className="Contract_browser__header_text">
                        
                            <h3> Change Orders ($) </h3> 
                        </TableCell>
                        <TableCell className="Contract_browser__header_text">
                        
                            <h3> Revised Contract ($) </h3> 
                        </TableCell>

  
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading_indicator()}
                    {filtered_contracts.map(build_table_body)}
        
                </TableBody>
            </Table>

        </TableContainer>
            <TablePagination
                rowsPerPageOptions={[2,5, 10, 15, 20]}
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
