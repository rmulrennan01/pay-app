import React, {useState, useRef} from 'react'

import TextField from '@mui/material/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function Project_Info(props) {
    const [start_date, set_start_date] = useState(new Date());
    const [project_data, set_project_data] = useState(props.project_info); 
    const ref_name = useRef(); 
    const ref_address_01 = useRef(); 
    const ref_address_02 = useRef(); 
    const ref_city = useRef(); 
    const ref_state = useRef(); 
    const ref_zip = useRef(); 
    const ref_number = useRef(); 

    const update_data = () => {
        let temp_data=
            {
                name: ref_name.current.value, 
                address_01: ref_address_01.current.value, 
                address_02: ref_address_02.current.value,
                city:ref_city.current.value,
                state:ref_state.current.value,
                zip:ref_zip.current.value,
                number:ref_number.current.value,
                date:start_date,
                app_count:0

            }; 
        
        set_project_data(temp_data); 
        
        props.update_project_info(temp_data); 
    }



    const states = [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
    'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
    'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
    'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];


    const update_data_select = (event: SelectChangeEvent) => {
        let temp_data=
            {
                name: ref_name.current.value, 
                address_01: ref_address_01.current.value, 
                address_02: ref_address_02.current.value,
                city:ref_city.current.value,
                state:event.target.value,
                zip:ref_zip.current.value,
                number:ref_number.current.value,
                date:start_date,
                app_count:0
            }; 
        
            set_project_data(temp_data); 
        
            props.update_project_info(temp_data); 
    }
    const buildList = (item) => {
        return(
            <MenuItem value={item}>{item}</MenuItem>
        )

    }


    return (
        <div>
            Please provide the project information below as it is shown on the contract. 
            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="Project Name" 
                inputRef={ref_name}
                onChange={()=>update_data()}
                defaultValue={project_data.name}
                sx={{width:400}}
            />
            <TextField 
                required 
                id="outlined-required" 
                label="Contract ID" 
                inputRef={ref_number}
                onChange={()=>update_data()}
                defaultValue={project_data.number}
                
            />


            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="Address" 
                inputRef={ref_address_01}
                onChange={()=>update_data()}
                defaultValue={project_data.address_01}
                sx={{width:400}}
            />
            <TextField  
                id="outlined-required" 
                label="Suite or Unit #" 
                inputRef={ref_address_02}
                onChange={()=>update_data()}
                defaultValue={project_data.address_02}
                sx={{width:200}}
            />
            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="City" 
                inputRef={ref_city}
                onChange={()=>update_data()}
                defaultValue={project_data.city}
                sx={{width:300}}
            />
            <Select
                labelId="state"
                id="outlined-required"
                defaultValue= {project_data.state}
                onChange={update_data_select}
                sx={{width:'75px'}}
            >
                {states.map(buildList)}
            </Select>
            <TextField 
                required 
                id="outlined-required" 
                label="Zip" 
                inputRef={ref_zip}
                onChange={()=>update_data()}
                defaultValue={project_data.zip}
                sx={{width:225}}
            />
            <br/><br/>
            Contract Date:  
            <div style={{ position: 'relative', zIndex: '100' }}>
                <DatePicker 
                    selected={start_date} 
                    onChange={(date) => set_start_date(date)}                     
                />
            </div> 
        </div>
            
            
      
    )
}

export default Project_Info
