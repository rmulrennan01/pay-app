
import React, {useState,useRef,useEffect} from 'react';

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





function Sov_table(props) {
    const [table_content, set_table_content] = useState(props.sov_data);
    const [total, set_total] = useState(0); 
    const [co_total, set_co_total] = useState(0); 
    const rows = useRef([]); 
    const inputs = useRef([]); 
    //const [co_sums, set_co_sums] = useState([]); 
    //const [prev_draws, set_prev_draws] = useState([]); 
    const [co_sums, set_co_sums] = useState(props.co_sums); 
    const [prev_draws, set_prev_draws] = useState([0]); 
    const [balances, set_balances] = useState([]); 
    const [max_input, set_max_input] = useState([]); 
    //const [saved_inputs, set_saved_inputs] = useState(props.saved_inputs); 

  

 

/*
    const get_co_sums = () =>{
        let temp_sums = []; 
        let sum = 0; 
        for (var i = 0; i<table_content.length; i++){
            if(table_content[i].change_orders.length >0){
                table_content[i].change_orders.map(item=>sum = Number(sum) + Number(item.value)); 
                temp_sums[i] = sum; 
            } 
            else{
                temp_sums[i] = 0; 
            }
            sum = 0; 
        }
        set_co_sums(temp_sums);  
    }

    const get_previous_draws = () =>{
        let temp_sums = []; 
        let sum = 0; 
        for (var i = 0; i<table_content.length; i++){
            if(table_content[i].hasOwnProperty('pay_apps')){
                if(table_content[i].pay_apps.length >0){
                    table_content[i].pay_apps.map(item=>sum = Number(sum) + Number(item.value)); 
                    temp_sums[i] = sum; 
                } 
                else{
                    temp_sums[i] = 0; 
                }
            }
            else{
                temp_sums[i] = 0; 
            }
            sum = 0; 
        }
        set_prev_draws(temp_sums);  
    }
    */

    const get_total = () =>{
        let sum = 0; 
        
        for (var i =0; i<table_content.length; i++){
            sum += Number(table_content[i].value); 
        }
        set_total(sum); 
    }

    const build_prev_draw_sums = () =>{
        let temp_sums = []; 
        let temp_val= 0; 
        for (let i = 0; i<props.sov_data.length; i++){
            temp_val = 0; 
            for (let k = 0; k<props.sov_data[i].pay_apps.length; k++){
                temp_val += props.sov_data[i].pay_apps[k]; 
            }
            temp_sums.push(temp_val); 

        }
        set_prev_draws(temp_sums); 
    }

    //calculated balances for all cost items
    const build_balance = () => {
        let temp_list = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_list[i] = Number(table_content[i].value) + Number(co_sums[i]) - Number(prev_draws[i]) - inputs.current[i].getValue(); 
       
        }
        set_balances(temp_list); 
        backup_inputs(); 
       
    }

    //calculates balance for just one cost item for onChange event. This avoids having to recalculate all cost items.
    const adjust_balance = (i) => {
        let temp_list = balances; 
        temp_list[i] = Number(table_content[i].value) + Number(co_sums[i]) - Number(prev_draws[i]) - inputs.current[i].getValue();
        set_balances(temp_list); 
        //console.log(temp_list); 
    }

    const build_max_input = () => {
        let temp_list = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_list[i] = String(Number(table_content[i].value)+Number(co_sums[i])-Number(prev_draws[i])); 
        }
        set_max_input(temp_list); 
        //console.log(max_input); 
    }




    //need to build the co_sums & prev draws within a function call inside useEffect. Otherwise, inside the body we get too many renders.
    useEffect(() => {
        //get_co_sums();
        {console.log("prev: ", prev_draws)}
        //get_previous_draws(); 
    }, [])

    //update the balances column in the table. This needs to wait until the previous draws state is populated.
    useEffect(()=>{
        build_balance(); 
        build_prev_draw_sums(); 
        build_max_input(); //TODO FIX!!!
        get_total(); 
        set_co_total(co_sums.reduce((prev,cur)=>prev+cur)); 
    }, [co_sums])
    
   
    const backup_inputs = () => {
        let temp_arry = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_arry[i] = inputs.current[i].getValue()
        }
        //set_saved_inputs(temp_arry); 
        props.update_inputs(temp_arry); 
    }

    const zero_inputs = () => {
        let temp_arry = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_arry[i] = 0;
        }
        //set_saved_inputs(temp_arry); 
        props.update_inputs(temp_arry); 

        let temp_list = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_list[i] = Number(table_content[i].value) + Number(co_sums[i]) - Number(prev_draws[i]); 
       
        }
        set_balances(temp_list); 
        
        //build_balance(); 
    }

    const bill_full = () =>{
        let temp_list = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_list[i] = Number(table_content[i].value)+Number(co_sums[i])-Number(prev_draws[i]); 
        }
        props.update_inputs(temp_list); 

        let temp_list2 = []; 
        for (var i = 0; i<table_content.length; i++){
            temp_list2[i] = 0;  
       
        }
        set_balances(temp_list2); 


        //build_balance(); 

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
        /*for (var i = 0; i<balances.length; i++){
            if(balances[i] == []){
                sum+= Number(0); 
            }
            else{
                sum+=Number(balances[i]); 
            }
        */
        let temp_balance = balances.reduce((prev,cur)=>prev+cur); 
        props.balance(temp_balance);
        return temp_balance; 
    }


       // console.log("inputs: ", props.saved_inputs)
        //if(props.saved_input === [] ){
          // return props.saved_inputs.reduce((prev,cur)=>prev+cur)
          // return 1; 

        //}
        //return 0; 
        //return props.saved_inputs === [] ? 0 : props.saved_inputs.reduce((prev,cur)=>prev+cur); 
   // }


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
                                //ref={(val) => (co_totals.current[index] = val)}
                               
                                value={co_sums[index]} 
                                
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                fixedDecimalScale={true} 
                                decimalScale={2}
                        />
                        
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                            value={Number(item.value)+Number(co_sums[index])} 
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={'$'} 
                            fixedDecimalScale={true} 
                            decimalScale={2}
                        />
                    </TableCell>
                    <TableCell>
                        <CurrencyFormat 
                                value={prev_draws[index]} 
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
                            value={(props.saved_inputs === []) ? 0 : props.saved_inputs[index]}
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
                            value={balances[index]} 
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
            
            
            
        
        
            
        Please provide the dollar amounts for each cost item that you intend to draw on for this pay period.  
        <br/>
        <br/> 
        <Button variant="contained" onClick={()=>bill_full()}> Bill in Full </Button> <Button variant="contained" onClick={()=>zero_inputs()}> Clear All </Button> 
        <br/> 

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
                    {(table_content.length == 0) ? null : table_content.map(build_table_body)}
        
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
                                    value={total} 
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
                                    value={co_total} 
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
                                    value={Number(total)+Number(co_total)} 
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
                                    value={prev_draws.reduce((prev,cur)=>prev+cur)} 
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
                                    value={input_total()} 
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
                                {console.log("balances :", balances)}
                                <CurrencyFormat 
                                    value={balance_total()} 
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
        
      

       

     


        </div>
    )
}

export default Sov_table
