import React, {useEffect, useState} from 'react'; 
import Button from '@mui/material/Button';
import Date_string from '../Utilities/Date_string.js'; 
import "./Pay_app_table.css"; 
import Sov_item_totals from "../Utilities/Sov_item_totals.js"; 
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';


//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CurrencyFormat from 'react-currency-format';
import Period_totals from '../Utilities/Period_totals';
import AddCircleIcon from '@mui/icons-material/AddCircle';



function Pay_app_table(props) {
  const table_headers = ["#", "Base Contract", "Change Orders", "Revised Contract",  
    "Previous Work Complete", "Work Complete This Period", "Payment This Period (Work Complete Less Retention)", "Remaining Balance", "App Date"];
  const [no_apps, set_no_apps] = useState(false); 

  const [period_summary, set_period_summary] = useState(props.period_summary);

  const open_modal = (ind) =>{
    props.set_pay_app_id(ind); 
    props.open_modal()
  }


  //function for formatting values to display on the pay app
  const currency = (val) =>{
    return(
        <CurrencyFormat 
        value={val}
        displayType={'text'} 
        thousandSeparator={true} 
        prefix={'$'} 
        fixedDecimalScale={true} 
        decimalScale={2}
        renderText={value => <>{value}</>} 
        />
        

    )
  }

  const no_app_message = () => {
    return(
      <div>
        
        No payment applications have been submitted.


      </div>


    )
  }

    
  const build_table_body = (item,index) => {
    
    
    return(
      <Tooltip title='Click to view more' arrow>

        <TableRow className="Pay_app_table__row" onClick={()=>open_modal(index)}>
          <TableCell>
            {index+1}
          </TableCell>
          <TableCell> 
            {currency(item.base_contract)}
          </TableCell>
          <TableCell>
            {currency(item.co)}
          </TableCell>
          <TableCell> 
            {currency(item.revised_value)}
          </TableCell>
          <TableCell> 
            {currency(item.prev_draws)}
          </TableCell>
          <TableCell> 
            {currency(item.cur_draw)}
          </TableCell>
          <TableCell> 
            {currency(item.payment)}
          </TableCell>

          <TableCell>
            {currency(item.balance)} 
          </TableCell>
          <TableCell>
            {Date_string(props.contract_info.pay_app_dates[index])} 
          </TableCell>
          
        </TableRow>
      </Tooltip>
    )
  }

  return (
    <div>
      
      <Button startIcon= {<AddCircleIcon/>} variant="contained" onClick={()=>window.location='/pay_app/'+ String(props.id)}> Create Application </Button>
        <Table>
          <TableHead> 
            <TableRow> 
              {table_headers.map((item) => <TableCell> <h3>{item}</h3></TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
           
            {(no_apps) && props.period_summary.length > 0  ? null : props.period_summary.map(build_table_body)}
          </TableBody>

        </Table>

      {props.contract_info.app_count == 0 ? no_app_message() : null}
    </div>
  )
}

export default Pay_app_table