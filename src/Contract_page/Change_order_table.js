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


function Change_order_table(props) {
    const [table_content, set_table_content] = useState(props.co_data);
    const [update, set_update] = useState(1); 
    const [total, set_total] = useState(0); 



    const build_table_body = (item,index) => {
        console.log("This is co: ", item.change_orders[0]); 
        if(item.change_orders.length >0){
            return (
            item.change_orders.map((element,index2) => {
                return(
                    <TableRow key= {index2}> 
                        <TableCell>
                            {element.id}
                        </TableCell>
                        <TableCell>
                            {item.cost_code}
                        </TableCell>
                        <TableCell>
                            {element.description}
                            
                        </TableCell>
                        <TableCell>
                            <CurrencyFormat value={element.value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                        
                        </TableCell>
            
                    </TableRow>
            );


        })); 
    }; 
      

    }




    return (
        <div> 
     
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        <TableCell> 
                            ID #
                        </TableCell> 
                        <TableCell>
                            Cost Code
                        </TableCell>
                        <TableCell>
                            Description
                        </TableCell>
                        <TableCell>
                            Value ($)
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>

                    {(table_content.length == 0) ? console.log("it's here") : table_content.map(build_table_body)}
                    {console.log(table_content)}

                </TableBody>
            </Table>

        </TableContainer>
        
        Change Order Total: $ {total}

       

     


        </div>
    )
}

export default Change_order_table

