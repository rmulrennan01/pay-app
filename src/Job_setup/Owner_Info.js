import React, {useState} from 'react';
import TextField from '@mui/material/TextField';

/*
owner_name: "", 
owner_address_01: "", 
owner_address_02: "",
owner_city:"",
owner_state:"",
owner_zip:"",
*/


function Owner_Info() {
    return (
        <div>
            Please provide the contact information for the company that you will be submitting your draw requests to.
            <br/><br/>
            <TextField required id="outlined-required" label="Company Name" />
            <br/><br/>
            <TextField required id="outlined-required" label="Address" />
            <TextField required id="outlined-required" label="Suite or Unit #" />
            <br/><br/>
            <TextField required id="outlined-required" label="City" />
            <TextField required id="outlined-required" label="State" />
            <TextField required id="outlined-required" label="Zip" />
            
        </div>
    )
}

export default Owner_Info
