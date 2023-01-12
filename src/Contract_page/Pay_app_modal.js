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
    const [contract_info, set_contract_info] = useState(props.contract_info); 
    const [saved_inputs, set_saved_inputs] = useState([]);  
    const [this_draw_total, set_this_draw_total] = useState(0); 
    const [app_id, set_app_id] = useState(Number(props.pay_app_id)); 
    const [trigger, set_trigger] = useState(true); 

    /*
    useEffect(() => {
        set_sov(props.sov); 
        set_app_id(Number(props.pay_app_id)); 
        set_contract_info(props.contract_info); 

    }, [])
    */
    
    const update_billed_to_date = (inputs) =>{
        set_saved_inputs(inputs); 
        let temp = 0; 
        
        inputs.map((item) => temp += Number(item));        
        set_this_draw_total(temp)
    }
 

    const enable_edit_mode = () => {
        set_edit_mode(true); 
        alert("Please note: Making adjustments to this payment application will result in any subsequent payment applications being updated accordingly.");
    }

    const open_pdf = () => {
        let new_tab = window.open('about:blank',"_blank"); 
        new_tab.location = ('/pdf/'+ String(id)+ '/' + String(props.pay_app_id+1)+'/' + "false"); 

    }

    const edit_button = () => {
        if (edit_mode){
            return(
                <Button variant="contained" onClick={()=>alert("Are you sure?")}> Save & Submit Changes </Button>
            );
        }
        else if (!edit_mode && app_id+1 == contract_info.app_count){
            return( 
                <Button variant="contained" onClick={()=>enable_edit_mode()}> Edit Application </Button>
            );
        }

        return(
            <Button variant="contained" disabled={true} onClick={()=>alert("Only the most recent payment application can be edited. To edit this application, all subsequent applications need to be deleted.")}> Edit Application </Button>
        )


    }

    const handle_prev_click = () => {
        console.log(app_id); 
        if(Number(app_id) > 0){
            set_app_id(app_id-1); 
            set_trigger(!trigger); 
            console.log("CLICKED")
        }
    }

    const handle_next_click = () =>{
        if(Number(app_id)+1 < contract_info.app_count){
            set_app_id(app_id+1); 
        }

    }
    

 

    return (
            //path='/pay_app/pdf/:id/:app_id' 
            <div>
                
                <Paper> 
                    <h2>Pay App # {app_id+1} </h2> 
                    
                    <br></br>
                    <Button variant='contained' onClick={()=>open_pdf()}>View PDF</Button>
                    {edit_button()}                
                    <Pay_app_modal_table
                        key = {app_id}
                        sov_data={sov} 
                        pay_app_id={app_id}
                        edit_mode={edit_mode}
                        contract_info={contract_info}
                    /> 
                    <br></br>
                    <Button variant='contained' disabled={app_id == 0 ? true : false} onClick={()=>handle_prev_click()}> {"<"} Prev</Button> <Button disabled={app_id+1 == Number(contract_info.app_count) ? true : false} onClick={()=>handle_next_click()} variant='contained' > Next {">"} </Button>

                </Paper>
                
            </div>
        
        
    )
}

export default Pay_app_modal
