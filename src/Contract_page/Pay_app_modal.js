import React, {useState, useEffect, useRef} from 'react'
import Paper from '@mui/material/Paper';
import Sov_table from '../Pay_app/Sov_table.js'; 


import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

/*
<Sov_table sov_data={sov} prev_draws={prev_draws} 
prev_draws_total={prev_draws_total} 
co_sums={co_sums} 
saved_inputs={saved_inputs} 
update_inputs={update_billed_to_date} 
balance={(item)=>set_balance(item)} />}
*/



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
           
        get_previous_draws(); 
        get_co_sums(); 
        console.log("loaded"); 
        
        //console.log("hey hey", contract_info); 
       // set_contract_total(contract_info ? contract_info.base_contract_value : 0); 
        //set_co_total(contract_info ? contract_info.co_value : 0); 
        
    }, [sov])

    const get_previous_draws = () =>{
        let temp_sums = []; 
        let sum = 0; 
        let total = 0; 
        //console.log("this is the sov here: ", sov); 
        for (var i = 0; i<sov.length; i++){
           // console.log("sov", sov); 
            if(sov[i].hasOwnProperty('pay_apps')){
                if(sov[i].pay_apps.length >0){
                    sov[i].pay_apps.map(item=>sum = Number(sum) + Number(item)); 
                    temp_sums[i] = sum; 
                    console.log("here2:",sum);
                    total +=sum; 
                } 
                else{
                    temp_sums[i] = 0; 
                }
            }
            else{
                temp_sums.push(0); 
            }
            sum = 0; 
        }
        set_prev_draws(temp_sums);  
        set_prev_draws_total(total); 
        //set_prev_draws_total(total); 
        console.log("total",total)
        //console.log("prev draws total: ", total)
    }

    const get_co_sums = () =>{
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
    }


    return (
        
            <div>
                You clicked on Pay App # {props.pay_app_id+1}
                {console.log("here is the stuff", props.sov_data)}
          
                {
                
                !co_sums || !prev_draws ? <div>{console.log("co_sums", co_sums)} </div> : <Sov_table 
                    sov_data={sov} 
                    prev_draws={prev_draws} 
                    prev_draws_total={prev_draws_total} 
                    co_sums={co_sums} 
                    saved_inputs={saved_inputs} 
                    update_inputs={update_billed_to_date} 
                    balance={(item)=>set_balance(item)}
                />
                }


            </div>
        
        
    )
}

export default Pay_app_modal
