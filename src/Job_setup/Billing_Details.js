import React, {useState,useRef} from 'react';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';




function Billing_Details(props) {
    
    const [billing_data, set_billing_data] = useState(props.billing_info);
    const ref_due_date = useRef(); 
    const ref_retention = useRef(); 
    const [retention, set_retention] = useState(); 
    
    const [due_date, set_due_date] = useState("20th");
    const due_date_options = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th",
        "13th","14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th",
        "27th", "28th", "Last"]; 

    const update_due_date = (event: SelectChangeEvent) =>{
        set_due_date(event.target.value); 
    }

    const handle_slider_change = (event: Event, newValue: number | number[]) => {
        set_retention(newValue);
        update_data();
      };
    

    const buildList = (item) => {
        return(
            <MenuItem value={item}>{item}</MenuItem>
        )

    }

    const update_data = () => {
        let temp_data=
            {
                
                retention: Number(ref_retention.current.textContent.slice(0,-1)),
                due_date: due_date
            }; 
        
        set_billing_data(temp_data); 
        props.update_billing_info(temp_data); 
        console.log(ref_retention.current.textContent)
    }

    return (
        <div>
            What percentage of your draw requests will be allocated towards retainage each period? 
            <br/> <br/> <br/> 
            <Slider 
                defaultValue={billing_data.retention} 
                min={0} 
                max={30} 
                aria-label="Default" 
                valueLabelDisplay="on" 
                valueLabelFormat={(val)=>val+'%'}
                onChangeCommitted={update_data}
                ref={ref_retention}
                
           
                
                
            />
            <br/><br/>
            Draw requests for this project are due on the <span>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={due_date}
                label="Due Date"
                onChange={update_due_date}
                
                
                
            >
                {due_date_options.map(buildList)}
            </Select> </span> day of the month.

            


        </div>
    )
}

export default Billing_Details
