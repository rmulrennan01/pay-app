
import React, {useState,useRef} from 'react';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


function Billing_details(props) {
    
    // const [billing_data, set_billing_data] = useState(props.billing_info);
     const ref_due_date = useRef(); 
     const ref_retention = useRef(); 
    // const [retention, set_retention] = useState(); 
     const [retention, set_retention] = useState(); 

     const full_draw_check = () =>{
        
        let draws = props.prev_draws.reduce((prev,cur)=>prev+cur); 
        let balance = Number(props.contract_total)+Number(props.co_sum)-Number(draws); 
        if (balance !=0){
            return(
                <div>
                    You are currently billing the remaining balance on this project. Do you want to bill for retainage as well?
                    <br/>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label"> </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value={false} control={<Radio />} label="Yes" onChange={()=>alert("hey")}/>
                            <FormControlLabel value={true} control={<Radio />} label="No" />
            
                        </RadioGroup>
                    </FormControl>
                </div>

            )

        }
        else{
            return(
                <>Hey spongebob</>
            )

        }
        

        
    }

 


     return (
         <div>
        
             {full_draw_check()}



             

         </div>
     )
 }

export default Billing_details
