import React, {useState, useRef} from 'react';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';




function Owner_Info(props) {
    const [owner_data, set_owner_data] = useState(props.owner_info)
    const ref_company_name = useRef(); 
    const ref_address_01 = useRef(); 
    const ref_address_02 = useRef(); 
    const ref_city = useRef(); 
    const ref_zip = useRef(); 
    //const [state, set_state] = useState(props.owner_info.state); 

    const update_data = () => {
        let temp_data=
            {
                name: ref_company_name.current.value, 
                address_01: ref_address_01.current.value, 
                address_02: ref_address_02.current.value,
                city:ref_city.current.value,
                state:props.owner_info.state,
                zip:ref_zip.current.value
            }; 
        console.log('UPDATE', temp_data); 

        set_owner_data(temp_data); 
        props.update_owner_info(temp_data); 
    }

    const states = [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
           'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
           'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
           'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
           'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];


    const update_data_select = (event: SelectChangeEvent) => {
        let temp_data=
            {
                name: ref_company_name.current.value, 
                address_01: ref_address_01.current.value, 
                address_02: ref_address_02.current.value,
                city:ref_city.current.value,
                state:event.target.value,
                zip:ref_zip.current.value
            }; 
        console.log('UPDATE', temp_data); 

        set_owner_data(temp_data); 
        props.update_owner_info(temp_data); 
    }

    

    const buildList = (item) => {
        return(
            <MenuItem value={item}>{item}</MenuItem>
        )

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
                sx={{width:'600px'}}
            />
            <br/><br/>
            <TextField 
                required 
                inputRef={ref_address_01} 
                id="outlined-required" 
                label="Address" 
                onChange={()=>update_data()}
                defaultValue={owner_data.address_01}
                sx={{width:'400px'}}
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
                sx={{width:'300px'}}

            />
            <Select
                labelId="state"
                id="outlined-required"
                defaultValue= {owner_data.state}
                onChange={update_data_select}
                sx={{width:'75px'}}
            >
                {states.map(buildList)}
            </Select>

            <TextField 
                required 
                inputRef={ref_zip} 
                id="outlined-required" 
                label="Zip" 
                onChange={()=>update_data()}
                defaultValue={owner_data.zip}
                sx={{width:'225px'}}
            />
            
        </div>
    )
}

export default Owner_Info
