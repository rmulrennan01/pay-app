import React, {useState, useEffect, useRef} from 'react'
import Paper from '@mui/material/Paper';
import Pay_app_modal_table from './Pay_app_modal_table.js'; 
import {useParams} from "react-router-dom";

import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';



function Pay_app_modal(props) {
    
    const [sov, set_sov] = useState(props.sov_data); 
    const [edit_mode, set_edit_mode] = useState(false); 
    const {id} = useParams();
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

    const enable_edit_mode = () => {
        set_edit_mode(true); 
        alert("Please note: Making adjustments to this payment application will result in any subsequent payment applications being updated accordingly.");
    }

    const open_pdf = () => {
        let new_tab = window.open('about:blank',"_blank"); 
        new_tab.location = ('/pdf/'+ String(id)+ '/' + String(props.pay_app_id+1)); 

    }

    const edit_button = () => {
        console.log("Here's the cheese", props.contract_info.app_count, props.pay_app_id+1); 
        if (edit_mode){
            return(
                <Button variant="contained" onClick={()=>alert("Are you sure?")}> Save & Submit Changes </Button>
            );
        }
        else if (!edit_mode && props.pay_app_id+1 === props.contract_info.app_count){
            return( 
                <Button variant="contained" onClick={()=>enable_edit_mode()}> Edit Application </Button>
            );
        }

        return(
            <Button variant="contained" onClick={()=>alert("Only the most recent payment application can be edited. To edit this application, all subsequent applications need to be deleted.")}> Edit Application </Button>
        )


    }

 

    return (
            //path='/pay_app/pdf/:id/:app_id' 
            <div>
                
                <Paper> 
                    <h2>Pay App # {props.pay_app_id+1} </h2> <br></br>
                    <Button variant='contained' onClick={()=>open_pdf()}>View PDF</Button>
                    {edit_button() }
                    
                    
                    
                
                </Paper> 
                 
                    

                
                 <Pay_app_modal_table
                    sov_data={sov} 
                    pay_app_id={props.pay_app_id}
                    edit_mode={edit_mode}
                    contract_info={props.contract_info}
                 /> 
                


                


            </div>
        
        
    )
}

export default Pay_app_modal
