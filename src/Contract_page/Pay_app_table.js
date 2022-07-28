import React, {useEffect, useState} from 'react'; 
import Button from '@mui/material/Button';

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CurrencyFormat from 'react-currency-format';



function Pay_app_table(props) {
  const [pay_apps, set_pay_apps] = useState([]);
  const [co_apps, set_co_apps] = useState([]);
  const table_headers = ["Base Contract", "Change Orders", "Previous Payments", "Payment This Period", "Remaining Balance", "Retention"];


  useEffect(() => {
    



  }, []); 

    //calculate total of CO's per app period
    const get_co_apps = () => {
        let temp_co_list = []; 


    }
  

    const build_table_body = (item, index) => {
      <TableRow>
        <TableCell> 
          <CurrencyFormat value={item.value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>

        
        </TableCell>

      </TableRow>
    }



  return (
    <div>
      <Button variant="contained" onClick={()=>window.location='/pay_app/'+ String(props.id)}> Create Application </Button>
        <Table>
          <TableHead> 
            <TableRow> 
              {table_headers.map((item) => <TableCell> {item} </TableCell> )}
            </TableRow>
          </TableHead>
        </Table>

    


    </div>
  )
}

export default Pay_app_table