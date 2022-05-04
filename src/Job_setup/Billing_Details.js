import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';




function Billing_Details() {
    const [due_date, set_due_date] = useState("20th");
    const due_date_options = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th",
        "13th","14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th",
        "27th", "28th", "Last"]; 

    const update_due_date = (event: SelectChangeEvent) =>{
        set_due_date(event.target.value); 
    }

    const buildList = (item) => {
        return(
            <MenuItem value={item}>{item}</MenuItem>
        )

    }

    return (
        <div>
            What percentage of your draw requests will be allocated towards retainage each period? 
            <Slider 
                defaultValue={5} 
                min={0} 
                max={30} 
                aria-label="Default" 
                valueLabelDisplay="auto" 
                valueLabelFormat={(val)=>val+'%'}
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
