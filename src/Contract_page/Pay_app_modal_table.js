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
    const [prev_draws, set_prev_draws] = useState([]); 
    const [prev_draws_total, set_prev_draws_total] = useState(0); 
    const [cur_draws, set_cur_draws]=useState([]); 
    const [cur_draws_total, set_cur_draws_total]=useState([]); 
    const [total, set_total] = useState(0); 
    const [co_total, set_co_total] = useState(0); 
    const rows = useRef([]); 
    const inputs = useRef([]); 
    const [co_sums, set_co_sums] = useState(props.co_sums); 
    const [balances, set_balances] = useState([]); 
    const [max_input, set_max_input] = useState([]); 
    const [cc_line_items, set_cc_line_items] = useState([]); 

 
    //needs to be done to each cost code item
    const build_cc_line_item = (cost_item) => {
        //get total of previous draws for this cc
        let temp_cc_line_items = cc_line_items; 
        //let cost_item = sov[sov_index]; 
        let prev_draws = 0; 
        let co_sum = 0; 
        for (let i = 0; i<props.pay_app_id; i++){
            prev_draws += Number(cost_item.pay_apps[i])
        }
        if(cost_item.hasOwnProperty('change_orders')){
            for (let a = 0; a<cost_item.change_orders.length; a++){
                co_sum = Number(co_sum) + Number(cost_item.pay_apps[a].value)
            }
        }


        temp_cc_line_items.push({prev:prev_draws, cur: Number(cost_item.pay_apps[props.pay_app_id]), co_sum: co_sum, cost_code:cost_item.cost_code, value:cost_item.value})
        set_cc_line_items(temp_cc_line_items); 




    }

    const get_prev_draws = () => {
        let sum = 0; 
        let temp_prev_draws = 0; 
        let draws_by_period = new Array(props.pay_app_id).fill(Number(0)); 
        let cur_draw_total = 0; 
       // let cur_draw_list = new A
        console.log("draws_by_period", draws_by_period); 
        console.log("pay_app_id", props.pay_app_id+1); 

        //only want to look at draws up to the clicked on pay_app
        for (let i = 0; i<sov.length; i++){
            //loop through each sov item
            if(sov[i].hasOwnProperty('pay_apps')){
                if(sov[i].pay_apps.length >0){
                    sum=0; 
                    //loop through each pay_app
                    for(let a = 0; a<props.pay_app_id+1; a++){
                        if(a<props.pay_app_id){
                            sum += Number(sov[i].pay_apps[a]); 
                            //console.log(sov[i].pay_apps[a]); 
                            draws_by_period[a] = Number(draws_by_period[a]) + Number(sov[i].pay_apps[a]); 
                        }
                        else{
                            cur_draw_total += Number(sov[i].pay_apps[a])

                        }
                    }
                    temp_prev_draws += sum; 
                }   

            }

            
        }
        set_prev_draws(draws_by_period);  
        set_prev_draws_total(temp_prev_draws); 
        set_cur_draws_total(cur_draw_total); 
        console.log("prev_draws: ", prev_draws); 
        console.log("prev_draws_total: ", prev_draws_total); 
        console.log("sov: ", sov); 
        console.log("ID: ", props.pay_app_id); 

    }


    const build_table_body2 = (item) => {
        <TableRow>
            <TableCell>
                {}
            </TableCell>



        </TableRow>





    }

    

   

    //get co_sums by sov_item
    const get_co_sums = () =>{
        console.log("this sov:", sov); 
        let temp_sums = []; 
        let sum = 0; 
        for (var i = 0; i<sov.length; i++){
            if(sov[i].change_orders.length >0){
                sov[i].change_orders.map(item=>sum = Number(sum) + Number(item.value)); 
                temp_sums[i] = sum; 
            } 
            else{
                temp_sums[i] = 0; 
            }
            sum = 0; 
        }
        set_co_sums(temp_sums);  
        console.log("co_sums:", co_sums); 
    }



    const get_total = () =>{
        let sum = 0; 
        
        for (var i =0; i<sov.length; i++){
            sum += Number(sov[i].value); 
        }
        set_total(sum); 
    }

    useEffect(() => {
           
       // get_prev_draws(); 
        //get_co_sums(); 
        sov.map(build_cc_line_item); 
        console.log("loaded"); 
        
        //console.log("hey hey", contract_info); 
       // set_contract_total(contract_info ? contract_info.base_contract_value : 0); 
        //set_co_total(contract_info ? contract_info.co_value : 0); 
        
    }, [])

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


    /*
    //update the balances column in the table. This needs to wait until the previous draws state is populated.
    useEffect(()=>{
        console.log("here"+props.prev_draws); 
        //build_prev_draw_sums(); 
        build_balance(); 
        build_max_input(); //TODO FIX!!!
        get_total(); 
        //set_co_total(co_sums.reduce((prev,cur)=>prev+cur)); 
    }, [co_sums])
    */
   
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
                {console.log("building table rows")}
                    <TableCell>
                        {item.cost_code}
                    </TableCell>
                    <TableCell>
                        TODO                        
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
                            onChange={()=>build_balance()}
                        />  
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                            value={'todo'} 
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
        /*
 

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
                    {(sov.length == 0) ? null : sov.map(build_table_body)}
        
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <h3>Totals</h3>
                        </TableCell>
                        <TableCell>
                            -
                        </TableCell>
                        <TableCell>
                            <h3>
                                <CurrencyFormat 
                                    value={0} 
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
                                    value={0} 
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
                                    value={0} 
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
                                    value={0} 
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
                                    value={0} 
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
                                    value={0} 
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
        */
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
                    {cc_line_items.map(build_table_body)}
                </TableBody>
                </Table>
                </TableContainer> 

           {console.log("here are the line items", cc_line_items)} 
           
        </Paper>
       
    )

}

export default Pay_app_modal_table









