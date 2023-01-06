
import React, {useState,useRef,useEffect} from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

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
    const [line_items, set_line_items] = useState([]); 
    const [footer, set_footer] = useState([]);
    const rows = useRef([]); 
    const inputs = useRef([]); 
    const headers = ["Cost Code", "Description", "Base Value ($)", "Change Orders ($)", "Revised Value ($)", "Work Complete in Previous Periods ($)",
                    "Work Complete This Period ($)", "Balance to Finish ($)"];

       
    useEffect(() => {
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
        
        //IF USER HAS PROVIDED INPUTS, WE NEED TO RECALCULATE TOTALS FOR WORK COMPLETE AND BALANCE
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
        
        //backup inputs to the parent component. This allows inputs to be preserved if leaving this section of the stepper
        backup_inputs();   
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
        props.update_inputs(temp_arry);  
    }


    //CALLED WHEN CLEAR BUTTON IS CLICKED
    const zero_inputs = () => {
        let zero_array = new Array(props.saved_inputs.length).fill(0); 
        props.update_inputs(zero_array); 
        let temp_footer = footer; 
        temp_footer.cur_draw = Number(0); 
        temp_footer.balance = Number(temp_footer.revised_value) - Number(temp_footer.prev_draws); 
        set_footer(temp_footer); 
    }

    const bill_in_full = () => {
        let temp_inputs = [];
        let temp_total = 0;
        let line_item_draw = 0; 
        for (let i = 0; i < line_items.length; i++){
            line_item_draw = Number(line_items[i].revised_value)-Number(line_items[i].prev_draws)
            temp_inputs.push(line_item_draw);
            temp_total += line_item_draw;  
        }
        props.update_inputs(temp_inputs); 

        let temp_footer = footer; 
        temp_footer.cur_draw = Number(temp_total); 
        temp_footer.balance = Number(0); 
        set_footer(temp_footer); 


    }



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

 

    

    return (
        <div> 
        Please provide the dollar amounts for each cost item that you intend to draw on for this pay period.  
        <br/>
        <br/> 
        <Button variant="contained" onClick={()=>bill_in_full()}> Bill in Full </Button> 
        <Button variant="contained" onClick={()=>zero_inputs()}> Clear All </Button> 
        <br/> 

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        {headers.map((item) => <TableCell><h4>{item}</h4></TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(line_items.length == 0) ? null : line_items.map(build_table_body)}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell>  </TableCell>
                        <TableCell> <h3> Totals </h3> </TableCell>
                        <TableCell> <h3> {currency(footer.base_value)} </h3> </TableCell>
                        <TableCell> <h3> {currency(footer.co_value)} </h3> </TableCell>
                        <TableCell> <h3> {currency(footer.revised_value)} </h3> </TableCell>
                        <TableCell> <h3> {currency(footer.prev_draws)} </h3> </TableCell>
                        <TableCell> <h3> {currency(footer.cur_draw)} </h3> </TableCell>
                        <TableCell> <h3> {currency(footer.balance)} </h3> </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
        </div>
    )
}

export default Sov_table
