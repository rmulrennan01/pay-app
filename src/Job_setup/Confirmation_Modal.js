import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

//sov={sov_data} owner={owner_info} project={project_info} billing={billing_info}

function Confirmation_Modal(props) {
    const get_total = () => {
        let total = Number(0); 
        props.sov.map((item)=>total+=Number(item.value)); 
        return total; 
    }
    
    const build_table_body = (item,index) => {
      
        return(
            <TableRow> 
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
        <Paper>
            Please verify the information below prior to submission. 

            <Paper> 
                <h4> Draw Requests will be submitted to: </h4>
                
                {props.owner_info.name}<br/> 
                
                {props.owner_info.address_01} {props.owner_info.address_02}<br/>
                {props.owner_info.city}, {props.owner_info.state} {props.owner_info.zip} <br/>
                
            </Paper>
            <br/> 
            <Paper> 
                <h4> For this project: </h4>
                {props.project_info.name} <br/> 
                Contract #: {props.project_info.number}<br/> 
                {props.project_info.address_01} {props.project_info.address_02} <br/>
                {props.project_info.city}, {props.project_info.state} {props.project_info.zip}
               

            </Paper>
            <br/> 
            <Paper> 
                <h3> Schedule of Values </h3>
            </Paper>
            <Paper> 
                <h3> Billing </h3>
                Draw Requests are due on the <span>{props.billing.due_date}</span> day of the month <br/> 
                Retainage will be: <span>{props.billing.retention}</span>%
            </Paper>

            <Paper> 
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
                            {(props.sov.length == 0) ? null : props.sov.map(build_table_body)}
                        </TableBody>
                    </Table> 
                </TableContainer> 

                The Total Contract amount is: ${get_total()}
            </Paper>

            <Button onClick={()=>props.submit_db()}> Submit </Button> 
        </Paper>
    )
}

export default Confirmation_Modal
