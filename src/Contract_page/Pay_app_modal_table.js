import React, {useState,useRef,useEffect} from 'react';

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
import TableFooter from '@mui/material/TableFooter';

import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import CurrencyFormat from 'react-currency-format';

function Pay_app_modal_table(props) {
    const [sov, set_sov] = useState(props.sov_data);
    const [column_totals, set_column_totals] = useState({}); 
    const rows = useRef([]); 
    const inputs = useRef([]); 
    const [co_sums, set_co_sums] = useState(props.co_sums); 
    const [balances, set_balances] = useState([]); 
    const [max_input, set_max_input] = useState([]); 
    const [cc_line_items, set_cc_line_items] = useState([]); 
    const [trigger, set_trigger] = useState(false); 
    const [user_input, set_user_input] = useState(false); 
    const [inputs_changed, set_inputs_changed] = useState(false);
    

 
    //needs to be done to each cost code item
    const build_cc_line_item = (cost_item) => {
        //get total of previous draws for this cc
        let temp_cc_line_items = cc_line_items; 
        //let cost_item = sov[sov_index]; 
        let prev_draws = 0; 
        let co_sum = 0; 
 
        //get total of all previous draws applied to this cost item
        for (let i = 0; i<props.pay_app_id; i++){
            prev_draws += Number(cost_item.pay_apps[i])
        }
        //get total of all CO's applied to this cost item
        if(cost_item.hasOwnProperty('change_orders')){
            for (let a = 0; a<cost_item.change_orders.length; a++){
                co_sum = Number(co_sum) + Number(cost_item.change_orders[a].value)
            }
        }
        temp_cc_line_items.push(
            {
                prev:prev_draws, 
                cur: Number(cost_item.pay_apps[props.pay_app_id]),
                co_sum: co_sum, 
                cost_code:cost_item.cost_code,
                value:cost_item.value,
                description:cost_item.description
            }); 
        set_cc_line_items(temp_cc_line_items);

    }

    const update_footer_totals = () => {
        let co_total = 0; 
        let prev_total = 0; 
        let cur_total = 0; 
        console.log('CC_LINE_ITEMS INSIDE FOOTER TOTALS', cc_line_items); 
        cc_line_items.map((item) => co_total = Number(co_total) + Number(item.co_sum)); 
        cc_line_items.map((item) => prev_total = Number(prev_total) + Number(item.prev));
        cc_line_items.map((item) => cur_total = Number(cur_total) + Number(item.cur));
        set_column_totals({
            co:co_total,
            prev:prev_total,
            cur:cur_total
        })
        console.log('COLUMN TOTALS', column_totals); 


    }


    useEffect(() => { 
        sov.map(build_cc_line_item); 
        update_footer_totals(); 

        set_trigger(!trigger); //needed to add this state change as re-render wasn't triggering within the state change inside the map function        
    }, [])

    useEffect(() => { 
        
        update_footer_totals(); 

        set_trigger(!trigger); //needed to add this state change as re-render wasn't triggering within the state change inside the map function        
    }, [cc_line_items])



    //calculated balances for all cost items
    const build_balance = () => {
        let temp_list = []; 
        for (var i = 0; i<sov.length; i++){
            if(props.prev_draws[i] == null){
                temp_list[i] = Number(sov[i].value) + Number(co_sums[i]) - inputs.current[i].getValue(); 
            }
            else{
                temp_list[i] = Number(sov[i].value) + Number(co_sums[i]) - Number(props.prev_draws[i]) - inputs.current[i].getValue(); 
            }
       
        }
        set_balances(temp_list); 
        backup_inputs(); 
       
    }

    //calculates balance for just one cost item for onChange event. This avoids having to recalculate all cost items.
    const adjust_balance = (i) => {
        let temp_list = balances; 
        temp_list[i] = Number(sov[i].value) + Number(co_sums[i]) - Number(props.prev_draws[i]) - inputs.current[i].getValue();
        set_balances(temp_list); 
        //console.log(temp_list); 
    }

    const build_max_input = () => {
        let temp_list = []; 
        for (var i = 0; i<sov.length; i++){
            temp_list[i] = String(Number(sov[i].value)+Number(co_sums[i])-Number(props.prev_draws[i])); 
        }
        set_max_input(temp_list); 
        //console.log(max_input); 
    }
   
    const backup_inputs = () => {
        let temp_arry = []; 
        for (var i = 0; i<sov.length; i++){
            temp_arry[i] = inputs.current[i].getValue()
        }
        //set_saved_inputs(temp_arry); 
        props.update_inputs(temp_arry); 
        console.log("temp_arry", temp_arry); 
    }

    const input_total = () => {
        let sum = 0; 
        console.log("INPUTS", inputs.current); 
        for (var i = 0; i<inputs.current.length; i++){
            if(inputs.current[i] == ""){
                sum+= Number(0); 
            }
            else{
                sum+=Number(inputs.current[i].getValue()); 
            }
        }
        return sum; 
    }

    /*
    const input_total = () => {
        let sum = 0; 
        for (var i = 0; i<props.saved_inputs.length; i++){
            if(props.saved_inputs[i] == ""){
                sum+= Number(0); 
            }
            else{
                sum+=Number(props.saved_inputs[i]); 
            }
        }
        return sum; 
    }
    */

    

    const balance_total = () => {
        console.log(balances); 
        if(balances.length ==0){
            return 0; 
        }

        let temp_balance = balances.reduce((prev,cur)=>prev+cur); 
        props.balance(temp_balance);
        return temp_balance; 
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
                                value={item.co_sum} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                fixedDecimalScale={true} 
                                decimalScale={2}
                        />
                        
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                            value={Number(item.value)+Number(item.co_sum)} 
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={'$'} 
                            fixedDecimalScale={true} 
                            decimalScale={2}
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                                value={item.prev} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                fixedDecimalScale={true} 
                                decimalScale={2}
                            />                    
                    </TableCell>
                    <TableCell >
                        {
                            props.edit_mode ?
                            <CurrencyTextField
                                label="Amount"
                                variant="outlined"
                                value={item.cur}
                                currencySymbol="$"
                                minimumValue="0"
                                maximumValue = {max_input[index]} 
                                //maximumValue = "12"
                                outputFormat="string"
                                decimalCharacter="."
                                digitGroupSeparator=","
                                leadingZero={"deny"}
                                ref={(val) => (inputs.current[index] = val)}
                                onChange={()=>set_inputs_changed(!inputs_changed)}
                            />  
                            :
                            <CurrencyFormat 
                                value={item.cur} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                fixedDecimalScale={true} 
                                decimalScale={2}
                            />
                        }


                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                            value={Number(item.value)+Number(item.co_sum)-Number(item.prev)-Number(item.cur)} 
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
                            <h4> Value ($) </h4> 
                        </TableCell>
                        <TableCell>
                            <h4> Change Orders ($) </h4>

                        </TableCell>
                        <TableCell>
                            <h4>Revised Value ($)</h4> 

                        </TableCell>
                        <TableCell>
                            <h4> Work Complete in Previous Periods ($) </h4> 
                        </TableCell>
                        <TableCell>
                            <h4>Work Complete this Period ($) </h4>
                        </TableCell>
                        <TableCell>
                            <h4>Balance to Finish ($) </h4>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cc_line_items.length ==0 ? null : cc_line_items.map(build_table_body)}
                </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                <h3>Totals</h3>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <h3>
                                    <CurrencyFormat 
                                        value={props.contract_info.base_contract_value} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={'$'} 
                                        fixedDecimalScale={true} 
                                        decimalScale={2}
                                    />
                                </h3> 
                        
                            </TableCell>
                            <TableCell>
                                <h3>
                                    <CurrencyFormat 
                                        value={column_totals.co} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={'$'} 
                                        fixedDecimalScale={true} 
                                        decimalScale={2}
                                    />
                                </h3> 
                        
                            </TableCell>
                            <TableCell>
                                <h3>
                                    <CurrencyFormat 
                                        value={props.contract_info.base_contract_value + column_totals.co} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={'$'} 
                                        fixedDecimalScale={true} 
                                        decimalScale={2}
                                    />
                                </h3> 
                        
                            </TableCell>
                            <TableCell>
                                <h3>
                                    <CurrencyFormat 
                                        value={column_totals.prev} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={'$'} 
                                        fixedDecimalScale={true} 
                                        decimalScale={2}
                                    />
                                </h3> 
                        
                            </TableCell>
                            <TableCell>
                                <h3>
                                    {(props.edit_mode) ?
                                        <CurrencyFormat 
                                            value={input_total()} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            prefix={'$'} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2}
                                        />
                                        :
                                        <CurrencyFormat 
                                            value={column_totals.cur} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            prefix={'$'} 
                                            fixedDecimalScale={true} 
                                            decimalScale={2}
                                        />
                                    }
                                </h3> 
                        
                            </TableCell>
                            <TableCell>
                                <h3>
                                    
                                    <CurrencyFormat 
                                        value={props.contract_info.base_contract_value+column_totals.co-column_totals.prev-column_totals.cur} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={'$'} 
                                        fixedDecimalScale={true} 
                                        decimalScale={2}
                                    />
                                </h3> 
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                </TableContainer> 
           
        </Paper>
       
    )

}

export default Pay_app_modal_table









