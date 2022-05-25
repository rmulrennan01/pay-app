
import React, {useState} from 'react';


import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import CurrencyFormat from 'react-currency-format';




//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';



function Contract_sov(props) {
    const [table_content, set_table_content] = useState(props.sov_data);
    const [update, set_update] = useState(1); 
    const [total, set_total] = useState(0); 

    
    const get_co_total = (co) => {
        let sum = 0; 
        if(co.length >0){
            co.map(item=>sum = Number(sum) + Number(item.value)); 
            return sum; 
        }; 
        return 0; 

    }



    const build_table_body = (item,index) => {
        const temp_co_total = get_co_total(item.change_orders); 
      
            return(
                <TableRow key={index}> 
                    <TableCell>
                        {item.cost_code}
                    </TableCell>
                    <TableCell>
                        {item.description}
                        
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat value={item.value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                       
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                            value={temp_co_total} 
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={'$'} 
                            fixedDecimalScale={true} 
                            decimalScale={2}
                        />
                       
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat value={Number(item.value)+Number(temp_co_total)} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                       
                    </TableCell>
         
                </TableRow>
            );
    }




    return (
        <div> 
     
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        <TableCell>
                            <h3> Cost Code </h3> 
                        </TableCell>
                        <TableCell>
                            <h3> Description </h3> 
                        </TableCell>
                        <TableCell>
                            <h3> Base Value ($) </h3> 
                        </TableCell>
                        <TableCell>
                            <h3> Change Orders  ($) </h3> 
                        </TableCell>
                        <TableCell>
                            <h3> Revised Value ($) </h3> 
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>

                    {(table_content.length == 0) ? console.log("it's here") : table_content.map(build_table_body)}
                    {console.log(table_content)}

                </TableBody>
            </Table>

        </TableContainer>
        
        Contract Total: $ {total}

       

     


        </div>
    )
}

export default Contract_sov

