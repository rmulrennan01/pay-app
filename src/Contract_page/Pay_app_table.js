import React, {useEffect, useState} from 'react'; 
import Button from '@mui/material/Button';
import "./Pay_app_table.css"; 

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CurrencyFormat from 'react-currency-format';



function Pay_app_table(props) {
  const [pay_apps, set_pay_apps] = useState(props.sov);
  const [co_apps, set_co_apps] = useState([]);
  const table_headers = ["#", "Base Contract", "Change Orders", "Revised Contract",  
    "Previous Work Complete", "Work Complete This Period", "Payment This Period (Work Complete Less Retention)", "Remaining Balance Including Retention"];
  const [period_info, set_period_info] = useState([]); 
  const [no_apps, set_no_apps] = useState(false); 


  //contract_info={contract_info} sov={sov}

  useEffect(() => {
    build_period_totals()
    



  }, []); 

    //calculate total of CO's per app period
    const build_period_totals = () => {

        let temp_app_totals = new Array(props.contract_info.app_count+1).fill(0); 
        let temp_co_totals = new Array(props.contract_info.app_count+1).fill(0); 
        
        //loop through each sov item
        for (let i = 0; i < props.sov.length; i++){
          let temp_sov_item = props.sov[i]; 
          //console.log("temp sov item is: ", temp_sov_item); 
        
          //if it does not exist
          if(!temp_sov_item.hasOwnProperty("pay_apps")){
            set_no_apps(true); 
            break; 
          }
          //create a combined draw total for each pay period   
          else if(temp_sov_item.pay_apps !==0){
            temp_sov_item.pay_apps.map((item,index) => temp_app_totals[index] = Number(temp_app_totals[index])+Number(item))
            
          }
          
          //build totals for each pay period
          if(temp_sov_item.change_orders !==0){
            temp_sov_item.change_orders.map((item) => temp_co_totals[item.pay_app-1] = Number(temp_co_totals[item.pay_app-1])+Number(item.value))
          }
        }

        if(!no_apps){
          let temp_line_item = []; 
          for (let i = 0; i<props.contract_info.app_count+1; i++){ //updated
            let temp_info = {base_contract:0, change_orders:0, revised_contract:0, this_draw:0, previous_payments:0, balance:0, retention:0}; 
            temp_info.base_contract=props.contract_info.base_contract_value;
            temp_info.change_orders=temp_co_totals[i];
            
            temp_info.this_draw=temp_app_totals[i]; 
            if(i==0){
              temp_info.previous_payments=0;
              temp_info.revised_contract=Number(props.contract_info.base_contract_value)+Number(temp_co_totals[i]); 
            }
            else{
              temp_info.previous_payments=Number(temp_line_item[i-1].this_draw)+Number(temp_line_item[i-1].previous_payments); 
              temp_info.revised_contract=Number(temp_line_item[i-1].revised_contract)+Number(temp_co_totals[i]); 
            }
            
            if(props.contract_info.hasOwnProperty('retention')){
              let ret = 1 - props.contract_info.retention; 
              temp_info.balance=Number(temp_info.revised_contract)-Number(temp_info.previous_payments)*ret -Number(temp_info.this_draw)*ret;
              temp_info.payment=temp_info.this_draw*(1-props.contract_info.retention);
            }
            else{
              temp_info.balance=Number(temp_info.revised_contract)-Number(temp_info.previous_payments)*.95-Number(temp_info.this_draw)*.95;
              temp_info.payment=temp_info.this_draw*.95; 
            }
            temp_line_item.push(temp_info); 
          }
          
          console.log("temp line item", temp_line_item); 
          //console.log("temp_app_totals", temp_app_totals); 
          //console.log("temp_co_totals", temp_co_totals); 
          //console.log("contract_info", props.contract_info); 
          set_period_info(temp_line_item); 
        }
        //period_info=temp_line_item; 

    }

    const open_modal = (ind) =>{
      props.set_pay_app_id(ind); 
      props.open_modal()
    }
  

    const build_table_body = (item,index) => {
      return(
      //let temp_info = {base_contract:0, change_orders:0, revised_contract:0, this_draw:0, previous_payments:0, balance:0, retention:0};
      <TableRow className="Pay_app_table__row" onClick={()=>open_modal(index)}>
        <TableCell>
          {index+1}
        </TableCell>
        <TableCell> 
          <CurrencyFormat value={item.base_contract} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
        </TableCell>
        <TableCell>
          <CurrencyFormat value={item.change_orders} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
        </TableCell>
        <TableCell> 
          <CurrencyFormat value={item.revised_contract} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
        </TableCell>
        <TableCell> 
          <CurrencyFormat value={item.previous_payments} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
        </TableCell>
        <TableCell> 
          <CurrencyFormat value={item.this_draw} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
        </TableCell>
        <TableCell> 
          <CurrencyFormat value={item.payment} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
        </TableCell>

        <TableCell> 
          <CurrencyFormat value={item.balance} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
        </TableCell>
        
      </TableRow>
      )
    }

  


  return (
    <div>
      
      <Button variant="contained" onClick={()=>window.location='/pay_app/'+ String(props.id)}> Create Application </Button>
        <Table>
          <TableHead> 
            <TableRow> 
              {table_headers.map((item) => <TableCell> <h3>{item}</h3></TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
            
            
            {(no_apps) ? console.log("it's here") : period_info.map(build_table_body)}

            
            
            
          </TableBody>

        </Table>

    


    </div>
  )
}

export default Pay_app_table