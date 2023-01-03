import React, {useEffect, useState} from 'react'; 
import Button from '@mui/material/Button';
import "./Pay_app_table.css"; 
import Sov_item_totals from "../Utilities/Sov_item_totals.js"; 

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CurrencyFormat from 'react-currency-format';
import Period_totals from '../Utilities/Period_totals';



function Pay_app_table(props) {
  const [pay_apps, set_pay_apps] = useState(props.sov);
  const [co_apps, set_co_apps] = useState([]);
  const table_headers = ["#", "Base Contract", "Change Orders", "Revised Contract",  
    "Previous Work Complete", "Work Complete This Period", "Payment This Period (Work Complete Less Retention)", "Remaining Balance Including Retention"];
  const [period_info, set_period_info] = useState([]); 
  const [no_apps, set_no_apps] = useState(false); 

  const [period_summary, set_period_summary] = useState([]);


  //contract_info={contract_info} sov={sov}

  useEffect(() => {
    build_table_data(); 
  
  }, []); 

 

    const open_modal = (ind) =>{
      props.set_pay_app_id(ind); 
      props.open_modal()
    }


    const build_table_data = () => {
      let temp_period_summary = []; 

      for (let i = 0; i<props.contract_info.app_count; i++){
        temp_period_summary.push(Period_totals(props.contract_info.base_contract_value,props.sov,i+1,0.05));
      }

      set_period_summary(temp_period_summary); 
      
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

    

    const build_table_body = (item,index) => {
      console.log("item", item); 
      
      return(

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
          {currency(Number(item.retention)+Number(item.balance))} 
        </TableCell>
        
      </TableRow>
      )
    }

    

  
    

  


  return (
    <div>
      {console.log("PERIOD TOTALS", period_summary)}
      
      <Button variant="contained" onClick={()=>window.location='/pay_app/'+ String(props.id)}> Create Application </Button>
        <Table>
          <TableHead> 
            <TableRow> 
              {table_headers.map((item) => <TableCell> <h3>{item}</h3></TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
            
            
            {/*(no_apps) ? console.log("it's here") : period_info.map(build_table_body)*/}
            {(no_apps) && period_summary.length > 0  ? console.log("it's here") : period_summary.map(build_table_body)}

            
            
            
          </TableBody>

        </Table>

    


    </div>
  )
}

export default Pay_app_table