import React, {useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import "./Page_G703.css";
import CurrencyFormat from 'react-currency-format';



import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';


function Page_G703(props) {
    const [sov, set_sov] = useState(props.sov); 
    const [rev_values, set_rev_values] =useState([]); 
    const [total_draws, set_total_draws] = useState([]); 
    const columnID = ['', 'A','B','C', 'C1', 'C2', 'D', 'E', 'F', 'G', 'H','I'];
    const tableHeaders=['COST CODE', 'ITEM NO.', 'DESCRIPTION OF WORK', 'SCHEDULED VALUE', 'CHANGE ORDERS', 
        'REVISED SCHEDULED VALUES', 'WORK COMPLETE FROM PREVIOUS APPLICATIONS', 'THIS PERIOD',
        'TOTAL COMPLETED & STORED TO DATE', '% (G÷C)','BALANCE TO FINISH', 'RETAINAGE'];

    useEffect(() => {
        //build revised line item values (base+co)
        let temp_rev_values = []; 
        props.sov.map((item,index) => temp_rev_values.push(Number(item.value)+Number(props.co_sums[index])) );
        set_rev_values(temp_rev_values); 
        
        //build this period totals (previous period + this period)
        let temp_total_draws = [];
        props.prev_draws.map((item,index)=>temp_total_draws.push(Number(props.saved_inputs[index] ?  props.saved_inputs[index]:0)+Number(item))); 
        set_total_draws(temp_total_draws); 
                
                
    }, [])


    const build_table_body = (item,index) => {
        //ref={(item) => (rows.current[index] = item)}
        return(
            <TableRow  key={index}> 
                <TableCell>
                    {item.cost_code}
                </TableCell>
                <TableCell>
                    {index}
                </TableCell>
                <TableCell>
                    {item.description}
                    
                </TableCell>
                <TableCell >
                    <CurrencyFormat 
                        
                        value={item.value} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    />
                    
                </TableCell>
                <TableCell>
                    <CurrencyFormat 
                            //ref={(val) => (co_totals.current[index] = val)}
                            
                            value={props.co_sums[index]} 
                            
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={'$'} 
                            fixedDecimalScale={true} 
                            decimalScale={2}
                    />
                    
                </TableCell>
                <TableCell>
                    <CurrencyFormat 
                        value={rev_values[index]} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    />
                </TableCell>
                <TableCell>
                    <CurrencyFormat 
                            value={props.prev_draws[index]} 
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={'$'} 
                            fixedDecimalScale={true} 
                            decimalScale={2}
                        />                    
                </TableCell>
                <TableCell >
                    <CurrencyFormat 
                        value={props.saved_inputs[index] ?  props.saved_inputs[index]:0} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    /> 
                    

                </TableCell>


                <TableCell>
                    <CurrencyFormat 
                        value={total_draws[index]}
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    />
                </TableCell>
                <TableCell>
                    {Number(total_draws[index]/rev_values[index]*100).toFixed(2)}%
                    
                </TableCell>
                <TableCell>
                    <CurrencyFormat 
                        value={Number(rev_values[index])-Number(total_draws[index])}
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        fixedDecimalScale={true} 
                        decimalScale={2}
                    />
                </TableCell>
                <TableCell>
                    <CurrencyFormat 
                        value={Number(total_draws[index])*.05}
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
    <div>
        <Paper>
            <h2>Continuation Sheet</h2>
        </Paper>
        <Paper> 
            <div className='page_G703__top'>
                <div className='page_G703__top__child'> 
                    In tabulations below, amounts are stated to the nearest dollar.<br/>
                    Use Column I on Contracts where variable retainage for line items may apply.<br/> 

                </div> 
                <div className='page_G703__top__child'> 

                </div> 
                <div className='page_G703__top__child'> 
                    Appliction Number: <br/>
                    Application Date:<br/>
                    Period To: <br/>
                    Contractor's Project #: <br/>
                </div> 
            </div>
        </Paper>
        <Paper>
            <Table> 
                <TableHead> 
                    <TableRow> 
                        {columnID.map((item) => <TableCell><h4>{item}</h4></TableCell> )}

                    </TableRow>
                    <TableRow> 
                        {tableHeaders.map((item) => <TableCell><h4>{item}</h4> </TableCell> )}

                    </TableRow>

                    
                </TableHead>
                <TableBody> 
                    {sov.map(build_table_body)}
                    {console.log("balance: ",props.balance)}

                        
                </TableBody> 
                

            </Table> 


        </Paper>

    </div>
  )
}

export default Page_G703