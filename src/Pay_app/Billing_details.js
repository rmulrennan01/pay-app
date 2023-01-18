
import React, {useState,useRef} from 'react';
import DatePicker from "react-datepicker";


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
     const [retention, set_retention] = useState(props.bill_retention); 

     const full_draw_check = () =>{         
        if (Number(props.balance) == 0){
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
                            defaultValue={retention}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Yes" onChange={()=>props.update_bill_retention(true)}/>
                            <FormControlLabel value={false} control={<Radio />} label="No" onChange={()=>props.update_bill_retention(false)}/>
            
                        </RadioGroup>
                    </FormControl>
                </div>

            )

        }
        else{
            return(
                <>There is still an open balance on this job.</>
            )

        }
    }


    const [app_date, set_app_date] = useState(new Date); 
    const app_date_picker = () => {
        return(
            <div style={{ position: 'relative', zIndex: '2' }}>
                <DatePicker 
                    selected={app_date} 
                    onChange={(date) => set_app_date(date)}                     
                />
            </div> 

        )
    }

    const [end_date, set_end_date] = useState(new Date((new Date).getFullYear(),(new Date).getMonth()+1,0)); 
    const end_date_picker = () => {
        return(
            <div style={{ position: 'relative', zIndex: '1' }}>
                <DatePicker 
                    selected={end_date} 
                    onChange={(date) => set_end_date(date)}                     
                />
            </div> 

        )
    }

 


     return (
         <div>
            Select the date you want to be displayed as the application date:
            {app_date_picker()}
            <br></br>
            Select the date for when this application period ends:
            {end_date_picker()}
            
            <br></br>
            {full_draw_check()}
         </div>
     )
 }

export default Billing_details
