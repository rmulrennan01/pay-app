import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CurrencyFormat from 'react-currency-format';
import Grid from '@mui/material/Grid';


//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';

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
                    <CurrencyFormat 
                        value={item.value}
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    />
                    
                </TableCell>

            </TableRow>
        );
    }



    return (
        <Paper sx={{mt:5, mb:30, mr:20, ml:20, padding: 2}} elevation={8}>
            <h3>Please verify the information below prior to submission. </h3>
            <Paper elevation={8} sx={{padding:2}}> 
                <Grid container>
                    <Grid item xs={6}>
                        
                            <h4> Draw Requests will be submitted to: </h4>
                            
                            {props.owner_info.name}<br/> 
                            
                            {props.owner_info.address_01} {props.owner_info.address_02}<br/>
                            {props.owner_info.city}, {props.owner_info.state} {props.owner_info.zip} <br/>
                            
                    
                    </Grid>                
                    <Grid item xs={6}>
                        
                            <h4> For this project: </h4>
                            {props.project_info.name} (Contract #: {props.project_info.number})<br/> 

                            {props.project_info.address_01} {props.project_info.address_02} <br/>
                            {props.project_info.city}, {props.project_info.state} {props.project_info.zip}
                    
                    </Grid>
                </Grid>
            </Paper>
            
            <Paper sx={{padding:2, mt:1}} elevation={8}> 
                <h4> Schedule of Values </h4>
                
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
                        <TableFooter>
                            <TableCell></TableCell>
                            <TableCell> <h3>TOTAL</h3></TableCell>
      
                            <TableCell>   
                                <h3>                        
                                <CurrencyFormat 
                                    value={get_total()}
                                    displayType={'text'} 
                                    thousandSeparator={true} 
                                    prefix={'$'} 
                                    fixedDecimalScale={true} 
                                    decimalScale={2}
                                />
                                </h3>
                            </TableCell>


                        </TableFooter>

                    </Table> 
                </TableContainer> 


                
            </Paper>
            <Paper sx={{padding:2, mt:1}} elevation={8}> 
                <h4> Billing </h4>
                Draw Requests are due on the <span>{props.billing.due_date}</span> day of the month <br/> 
                Retainage will be: <span>{props.billing.retention}</span>%
            </Paper>

            <br></br>

            <Button variant='contained' onClick={()=>props.submit_db()}> Submit </Button> 
            <Button onClick={()=>props.close()} sx={{ml:2}}> Cancel </Button> 
        </Paper>
    )
}

export default Confirmation_Modal
