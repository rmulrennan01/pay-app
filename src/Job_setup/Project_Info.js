import React, {useState} from 'react'

import TextField from '@mui/material/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



/*
project_name:"",
project_address_01:"",
project_address_02:"",
project_city:"",
project_state:"",
project_zip:"",
contract_number:"",
contract_date: ""

*/

function Project_Info() {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <div>
            Please provide the project information below as it is shown on the contract. 
            <br/><br/>
            <TextField required id="outlined-required" label="Project Name" />
            <br/><br/>
            <TextField required id="outlined-required" label="Contract ID" />
            <br/><br/>
            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />

            <br/><br/>
            <TextField required id="outlined-required" label="Address" />
            <TextField  id="outlined-required" label="Suite or Unit #" />
            <br/><br/>
            <TextField required id="outlined-required" label="City" />
            <TextField required id="outlined-required" label="State" />
            <TextField required id="outlined-required" label="Zip" />
        </div>
            
            
      
    )
}

export default Project_Info
