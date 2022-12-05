import React, {useState, useEffect, useRef} from 'react'
import Paper from '@mui/material/Paper';
import Pay_app_modal_table from './Pay_app_modal_table.js'; 


import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';



function Pay_app_modal(props) {
    
    const [sov, set_sov] = useState(props.sov_data); 
    const [prev_draws, set_prev_draws] = useState([]); 
    const [prev_draws_total, set_prev_draws_total] = useState(0); 
    const [co_sums, set_co_sums] = useState([]);
    const [saved_inputs, set_saved_inputs] = useState([]);  
    const [balance, set_balance] = useState(0); 
    const [this_draw_total, set_this_draw_total] = useState(0); 
    
    const update_billed_to_date = (inputs) =>{
        set_saved_inputs(inputs); 
        let temp = 0; 
        
        inputs.map((item) => temp += Number(item));        
        set_this_draw_total(temp)
    }
    useEffect(() => {
           
       // get_previous_draws(); 
        //get_co_sums(); 
        console.log("loaded"); 
        
        //console.log("hey hey", contract_info); 
       // set_contract_total(contract_info ? contract_info.base_contract_value : 0); 
        //set_co_total(contract_info ? contract_info.co_value : 0); 
        
    }, [sov])

 

    return (
        
            <div>
                <Paper> 
                    You clicked on Pay App # {props.pay_app_id+1} <br></br>
                    COs by SOV:
                    {co_sums.map((item)=>item+", ")} <br></br>
                    Previous draws:
                    {prev_draws.map((item)=>item+", ")}
                    
                    
                
                </Paper> 
                 
                    

                
                 <Pay_app_modal_table
                    sov_data={sov} 
                    pay_app_id={props.pay_app_id}
                 /> 
                


                


            </div>
        
        
    )
}

export default Pay_app_modal
