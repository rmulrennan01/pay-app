
import React, {useState} from 'react';


import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';



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



    const build_table_body = (item,index) => {
      
            return(
                <TableRow key={index}> 
                    <TableCell>
                        {item.cost_code}
                    </TableCell>
                    <TableCell>
                        {item.description}
                        
                    </TableCell>
                    <TableCell>
                        {item.value}
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

                    {(table_content.length == 0) ? null : table_content.sov.map(build_table_body)}

                </TableBody>
            </Table>

        </TableContainer>
        
        Contract Total: $ {total}

       

     


        </div>
    )
}

export default Contract_sov

