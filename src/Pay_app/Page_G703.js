import React, {useState} from 'react';
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
    const columnID = ['', 'A','B','C', 'C1', 'C2', 'D', 'E', 'F', 'G1', 'G2', 'H','I'];
    const tableHeaders=['COST CODE', 'ITEM NO.', 'DESCRIPTION OF WORK', 'SCHEDULED VALUE', 'CHANGE ORDERS', 
        'REVISED SCHEDULED VALUES', 'WORK COMPLETE FROM PREVIOUS APPLICATIONS', 'THIS PERIOD', 'MATERIALS PRESENTLY STORED',
        'TOTAL COMPLETED & STORED TO DATE', '% (G÷C)','BALANCE TO FINISH', 'RETAINAGE'];

        const build_table_body = (item,index) => {
            //ref={(item) => (rows.current[index] = item)}
            return(
                <TableRow  key={index}> 
                    <TableCell>
                        {item.cost_code}
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
                               
                                value={12} 
                                
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                fixedDecimalScale={true} 
                                decimalScale={2}
                        />
                        
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                            value={Number(item.value)+Number(12)} 
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={'$'} 
                            fixedDecimalScale={true} 
                            decimalScale={2}
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                                value={12} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                fixedDecimalScale={true} 
                                decimalScale={2}
                            />                    
                    </TableCell>
                    <TableCell >
                        

                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                            value={12} 
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

                        
                </TableBody> 
                

            </Table> 


        </Paper>

    </div>
  )
}

export default Page_G703