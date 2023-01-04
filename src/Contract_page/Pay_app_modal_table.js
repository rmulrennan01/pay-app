import React, {useState,useRef,useEffect} from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import Sov_item_totals from '../Utilities/Sov_item_totals.js'; 
import Totals_by_key from '../Utilities/Totals_by_key.js'; 



//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';

import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import CurrencyFormat from 'react-currency-format';

function Pay_app_modal_table(props) {
    const [sov, set_sov] = useState(props.sov_data);
    const [footers, set_footers] = useState([]);
    const rows = useRef([]); 
    const inputs = useRef([]); 
    const [max_input, set_max_input] = useState([]); 
    const [trigger, set_trigger] = useState(false); 
    const [retention, set_retention] = useState(.05); 
    const [line_items, set_line_items] = useState([]); 


    useEffect(() => {
        set_line_items(Sov_item_totals(sov,props.pay_app_id,0.05)); 

    }, [])
    

    useEffect(() => { 
        //sov.map(build_cc_line_item); 
        build_footer_totals(); 
        set_trigger(!trigger); //needed to add this state change as re-render wasn't triggering within the state change inside the map function        
    }, [line_items])

    //this updates the line items in the pay app edit mode. Only needs to run one time after edit mode is enabled.
    useEffect(() => {
        if(props.edit_mode){
            adjust_totals();
        }
    }, [props.edit_mode])

 
 
  

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

    const build_footer_totals = () => {
        let footer = [];
        footer.push("Totals");
        footer.push(""); 
        footer.push(currency(Totals_by_key(line_items, "value")));
        footer.push(currency(Totals_by_key(line_items, "co_prev")+Totals_by_key(line_items, "co_cur")));
        footer.push(currency(Totals_by_key(line_items, "revised_value")));
        footer.push(currency(Totals_by_key(line_items, "prev_draws")));
        /*
        if(props.edit_mode){
            alert("hey")
            let temp_input_sum = Number(0); 
            console.log("inputs", inputs.current[0]); 
            inputs.current.map((item)=>temp_input_sum+=Number(item.getValue())); 
            footer.push(currency(Totals_by_key(temp_input_sum)));
            //footer.push(currency(Totals_by_key(line_items, "cur_draw")));


        }
        else{
            footer.push(currency(Totals_by_key(line_items, "cur_draw")));

        }
        */
        footer.push(currency(Totals_by_key(line_items, "cur_draw")));
        footer.push(currency(Totals_by_key(line_items, "cur_payment")));
        footer.push(currency(Totals_by_key(line_items, "balance")+Totals_by_key(line_items, "retention")));

        set_footers(footer); 
    }

    //This adjusts the line items totals to accomodate user input when editing an existing payment application.
    const adjust_totals = () => {
        let footer_copy = footers; 
        let temp_input_sum = Number(0); 
        inputs.current.map((item)=>temp_input_sum+=Number(item.getValue())); 
        footer_copy[6] = currency(temp_input_sum);
        footer_copy[7] = currency(temp_input_sum*(1-retention));
        footer_copy[8] = currency(Number(footer_copy[4].props.value)-Number((footer_copy[5].props.value*(1-retention)))-Number(footer_copy[7].props.value));
        //console.log("big cheese", footer_copy[4].props.value)
        set_footers(footer_copy); 
        adjust_line_items(); 
        set_trigger(!trigger);
    }

    //This adjusts the line items to accomodate user input when editing an existing payment application.
    const adjust_line_items = () => {
        let line_item_copy = line_items; 

        for (let i=0; i<line_item_copy.length; i++){
            line_item_copy[i].cur_payment = inputs.current[i].getValue()* (1-Number(retention)); 
            let draws = Number(line_item_copy[i].prev_draws) + Number(inputs.current[i].getValue()); 
            line_item_copy[i].balance = Number(line_item_copy[i].revised_value) - Number(draws);
            line_item_copy[i].retention = draws * (Number(retention)); 
        }

        set_line_items(line_item_copy); 


    }


    const backup_inputs = () => {
        let temp_arry = []; 
        for (var i = 0; i<sov.length; i++){
            temp_arry[i] = inputs.current[i].getValue()
        }
        //set_saved_inputs(temp_arry); 
        props.update_inputs(temp_arry); 
        //console.log("temp_arry", temp_arry); 
    }



    const build_table_body = (item,index) => {
        return(
            <TableRow ref={(item) => (rows.current[index] = item)} key={index}> 
                <TableCell>
                    {item.cost_code}
                </TableCell>
                <TableCell>
                    {item.description}                        
                </TableCell>
                <TableCell >
                    {currency(item.value)}
                </TableCell>
                <TableCell>
                    {currency(Number(item.co_cur)+Number(item.co_prev))}
                </TableCell>
                <TableCell>
                    {currency(item.revised_value)}
                </TableCell>
                <TableCell> 
                    {currency(item.prev_draws)}                  
                </TableCell>
                <TableCell >
                    {
                        props.edit_mode ?
                        
                        <CurrencyTextField
                            label="Amount"
                            variant="outlined"
                            value={0}
                            currencySymbol="$"
                            minimumValue="0"
                            maximumValue = {item.revised_value-item.prev_draws} 
                            //maximumValue = "12"
                            outputFormat="string"
                            decimalCharacter="."
                            digitGroupSeparator=","
                            leadingZero={"deny"}
                            ref={(val) => (inputs.current[index] = val)}
                            onChange={()=>adjust_totals()}
                        />  
                        
                        :
                        currency(item.cur_draw)
                    }
                </TableCell>
                <TableCell>
                    {currency(item.cur_payment)}
                </TableCell>
                <TableCell>
                    {currency(Number(item.balance)+Number(item.retention))}
                </TableCell>
            </TableRow>
        );
    }




    return (
       <Paper> 
           
           
           <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        <TableCell>
                            <h4> Cost Code </h4> 
                        </TableCell>
                        <TableCell>
                            <h4>Description</h4> 
                        </TableCell>
                        <TableCell>
                            <h4> Value  </h4> 
                        </TableCell>
                        <TableCell>
                            <h4> Change Orders </h4>

                        </TableCell>
                        <TableCell>
                            <h4>Revised Value </h4> 

                        </TableCell>
                        <TableCell>
                            <h4> Work Complete in Previous Periods </h4> 
                        </TableCell>
                        <TableCell>
                            <h4>Work Complete this Period </h4>
                        </TableCell>
                        <TableCell>
                            <h4>Payment This Period (Work Complete Less Retention) </h4>
                        </TableCell>
                        <TableCell>
                            <h4>Balance to Finish Including Retention  </h4>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/*cc_line_items.length ==0 ? null : cc_line_items.map(build_table_body)*/}
                    {line_items.length ==0 ? null : line_items.map(build_table_body)}
                </TableBody>
                    <TableFooter>
                        <TableRow>
                            {footers.map((item)=><TableCell><h3>{item}</h3></TableCell>)}

                        </TableRow>
                    </TableFooter>
                </Table>
                </TableContainer> 
           
        </Paper>
       
    )

}

export default Pay_app_modal_table









