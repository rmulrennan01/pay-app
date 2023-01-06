
import React, {useState,useRef,useEffect} from 'react';
import Totals_by_key from '../Utilities/Totals_by_key.js'; 


import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';



//Forms
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';

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
import { PictureInPictureAltSharp } from '@material-ui/icons';





function Sov_table(props) {
    const [line_items, set_line_items] = useState([]); 
    const [footer, set_footer] = useState([]);
    const [user_input, set_user_input] = useState(false); 
    const rows = useRef([]); 
    const inputs = useRef([]); 
    //const [co_sums, set_co_sums] = useState([]); 
    //const [prev_draws, set_prev_draws] = useState([]); 
    const [co_sums, set_co_sums] = useState(props.co_sums); 
    const [saved_inputs, set_saved_inputs] = useState(props.saved_inputs); 
    const [balances, set_balances] = useState([]); 
    const [max_input, set_max_input] = useState([]); 
    const [trigger, set_trigger] = useState(true); 
    //const [saved_inputs, set_saved_inputs] = useState(props.saved_inputs); 

  /*
    description
    base_value
    co_prev
    co_cur
    revised_value
    prev_draws
    cur_draw
    prev_payment
    cur_payment
    retention (.05 is typical)
    balance (exluding retention)
    cost_code
    */
       
    useEffect(() => {
        //default to the line_items passed as props
        console.log("SAVED INPUTS", props.saved_inputs)
        
        set_line_items(props.line_items);
       

        get_balances(); 
    }, [])

    const get_balances = () => {
        let cur_draw_total = 0; 
        let temp_balance = (Number(props.contract_info.co_value)+Number(props.contract_info.base_contract_value)-Number(props.contract_info.prev_draws)-Number(props.contract_info.this_draw));


        let temp_footer = 
        {
            base_value: props.contract_info.base_contract_value,
            co_value: props.contract_info.co_value,
            revised_value:(Number(props.contract_info.co_value)+Number(props.contract_info.base_contract_value)),
            prev_draws:Number(props.contract_info.prev_draws)+Number(props.contract_info.this_draw),
            cur_draw:cur_draw_total,
            balance:temp_balance
        };
        
        //IF USE HAS PROVIDED INPUTS, WE NEED TO RECALCULATE TOTALS FOR WORK COMPLETE AND BALANCE
        if (props.saved_inputs.length>0){
            for(let i=0; i<props.saved_inputs.length; i++){
                cur_draw_total += Number(props.saved_inputs[i])
            }
            temp_balance = Number(temp_footer.revised_value)-Number(temp_footer.prev_draws)-Number(cur_draw_total); 
        }

        temp_footer.cur_draw = cur_draw_total; 
        temp_footer.balance = temp_balance; 
        set_footer(temp_footer); 
    }

  

    const handle_input = (i) => {
        let temp_line_items = line_items; 
        let temp_footer = footer; 
        //needs to update balance to finish for line item
        //temp_line_items[i].balance = temp_line_items[i].revised_value-temp_line_items[i].prev_draws-inputs.current[i].getValue(); 

        //needs to update work complete this period total
        let temp_sum = Number(0); 
        for (let a=0; a< inputs.current.length; a++){
            temp_sum += Number(inputs.current[a].getValue())
        }
        temp_footer.cur_draw = temp_sum; 
 

        //needs to update balance total for the period
        temp_footer.balance = Number(temp_footer.revised_value) - Number(temp_footer.prev_draws)- Number(temp_footer.cur_draw); 
        

        set_line_items(temp_line_items); 
        set_footer(temp_footer); 
        
        //set_trigger(!trigger); 
        

        //backup inputs to the parent component. This allows inputs to be preserved if leaving this section of the stepper
        backup_inputs();   

        set_user_input(true); 
    }
     
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

    const backup_inputs = () => {
        let temp_arry = []; 
        for (var i = 0; i<line_items.length; i++){
            temp_arry[i] = inputs.current[i].getValue()
        }
        //set_saved_inputs(temp_arry); 
        props.update_inputs(temp_arry);  
    }

    

    /*
    const zero_inputs = () => {
        let temp_arry = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_arry[i] = 0;
        }
        //set_saved_inputs(temp_arry); 
        props.update_inputs(temp_arry); 

        let temp_list = []; 
        for (var i = 0; i<table_content.length; i++){
            if(props.prev_draws[i]==null){
                temp_list[i] = Number(table_content[i].value) + Number(co_sums[i]) ; 
            }
            else{
                temp_list[i] = Number(table_content[i].value) + Number(co_sums[i]) - Number(props.prev_draws[i]);
            }
       
        }
        set_balances(temp_list); 
        
        //build_balance(); 
    }
    */

    /*
    const bill_full = () =>{
        let temp_list = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_list[i] = Number(table_content[i].value)+Number(co_sums[i])-Number(props.prev_draws[i]); 
        }
        props.update_inputs(temp_list); 

        let temp_list2 = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_list2[i] = 0;  
       
        }
        set_balances(temp_list2); 

    }
    */




/*
    description
    base_value
    co_prev
    co_cur
    revised_value
    prev_draws
    cur_draws
    prev_payment
    cur_payment
    retention (.05 is typical)
    balance (exluding retention)
    cost_code
*/


    const build_table_body = (item, index) => {
        return(
            <TableRow ref={(item) => (rows.current[index] = item)} key={index}> 
            {console.log("building table rows")}
                <TableCell> {item.cost_code} </TableCell>
                <TableCell> {item.description} </TableCell>
                <TableCell > {currency(item.value)} </TableCell>
                <TableCell> {currency(Number(item.co_prev)+Number(item.co_cur))} </TableCell>
                <TableCell> {currency(item.revised_value)}</TableCell>
                <TableCell> {currency(item.prev_draws)}</TableCell>
                <TableCell > 
                    <CurrencyTextField
                        label="Amount"
                        variant="outlined"
                        value={props.saved_inputs.length ===0 ? 0 : props.saved_inputs[index]}
                        currencySymbol="$"
                        minimumValue="0"
                        maximumValue = {Number(item.revised_value)-Number(item.prev_draws)} 
                        outputFormat="string"
                        decimalCharacter="."
                        digitGroupSeparator=","
                        leadingZero={"deny"}
                        ref={(val) => (inputs.current[index] = val)}
                        onChange={()=>handle_input(index)}
                    />  
                </TableCell>
                <TableCell> 
                    {
                        props.saved_inputs.length ===0 ? 
                            currency(Number(item.revised_value)-Number(item.prev_draws)) 
                            
                            :
                            currency(Number(item.revised_value)-Number(item.prev_draws)-Number(props.saved_inputs[index]))
                    } 
                
                </TableCell>
            </TableRow>
        );
    }

 

    const headers = ["Cost Code", "Description", "Base Value ($)", "Change Orders ($)", "Revised Value ($)", "Work Complete in Previous Periods ($)",
                    "Work Complete This Period ($)", "Balance to Finish ($)"];

    return (
        <div> 
        Please provide the dollar amounts for each cost item that you intend to draw on for this pay period.  
        <br/>
        <br/> 
        <Button variant="contained" onClick={()=>console.log("bill full")}> Bill in Full </Button> <Button variant="contained" onClick={()=>console.log("zero")}> Clear All </Button> 
        <br/> 

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        {headers.map((item) => <TableCell><h4>{item}</h4></TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/*(table_content.length == 0) ? null : table_content.map(build_table_body)*/}
                    {(line_items.length == 0) ? null : line_items.map(build_table_body)}
        
                </TableBody>
                {/*base_value, co_value, revised_value, prev_draws, cur_draw, balance */}

                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <h3>Totals</h3>
                        </TableCell>
                        <TableCell>
                            -
                        </TableCell>
  
                        <TableCell>
                            <h3>{currency(footer.base_value)}</h3> 
                        </TableCell>
                        <TableCell>
                            <h3> {currency(footer.co_value)}</h3>                 
                        </TableCell>
                        <TableCell>
                            <h3> {currency(footer.revised_value)}</h3>                 
                        </TableCell>

                        <TableCell>
                            <h3> {currency(footer.prev_draws)}</h3>   
                        
                        </TableCell>
                        <TableCell>
                            <h3> {currency(footer.cur_draw)} </h3>                  
                        </TableCell>
                        <TableCell>
                            <h3> {currency(footer.balance)} </h3>  
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
        </div>
    )
}

export default Sov_table
