import React, {useState, useRef} from 'react';
import TextField from '@mui/material/TextField';

/*
owner_name: "", 
owner_address_01: "", 
owner_address_02: "",
owner_city:"",
owner_state:"",
owner_zip:"",
*/


function Owner_Info(props) {
    const [owner_data, set_owner_data] = useState(props.owner_info)
    const ref_company_name = useRef(); 
    const ref_address_01 = useRef(); 
    const ref_address_02 = useRef(); 
    const ref_city = useRef(); 
    const ref_state = useRef(); 
    const ref_zip = useRef(); 

    const update_data = () => {
        let temp_data=
            {
                name: ref_company_name.current.value, 
                address_01: ref_address_01.current.value, 
                address_02: ref_address_02.current.value,
                city:ref_city.current.value,
                state:ref_state.current.value,
                zip:ref_zip.current.value
            }; 
        
        set_owner_data(temp_data); 
        props.update_owner_info(temp_data); 
    }

    return (
        <div>
            Please provide the contact information for the company that you will be submitting your draw requests to.
            <br/><br/>
            <TextField 
                required 
                inputRef={ref_company_name} 
                id="outlined-required" 
                label="Company Name" 
                onChange={()=>update_data()}
                defaultValue={owner_data.name}
            />
            <br/><br/>
            <TextField 
                required 
                inputRef={ref_address_01} 
                id="outlined-required" 
                label="Address" 
                onChange={()=>update_data()}
                defaultValue={owner_data.address_01}
            />
            <TextField 
                required 
                inputRef={ref_address_02} 
                id="outlined-required" 
                label="Suite or Unit #" 
                onChange={()=>update_data()}
                defaultValue={owner_data.address_02}
            />
            <br/><br/>
            <TextField 
                required 
                inputRef={ref_city} 
                id="outlined-required" 
                label="City" 
                onChange={()=>update_data()}
                defaultValue={owner_data.city}
            />
            <TextField 
                required 
                inputRef={ref_state} 
                id="outlined-required" 
                label="State" 
                onChange={()=>update_data()}
                defaultValue={owner_data.state}
            />
            <TextField 
                required 
                inputRef={ref_zip} 
                id="outlined-required" 
                label="Zip" 
                onChange={()=>update_data()}
                defaultValue={owner_data.zip}
            />
            
        </div>
    )
}

export default Owner_Info
