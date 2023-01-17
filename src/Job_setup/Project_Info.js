import React, {useState, useRef} from 'react'

import TextField from '@mui/material/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



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
    const ref_date = useRef(); 

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
            />
            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="Contract ID" 
                inputRef={ref_number}
                onChange={()=>update_data()}
                defaultValue={project_data.number}
            />
            <br/><br/>
            Contract Date:  <br/>
            <div style={{ position: 'relative', zIndex: '100' }}>
                <DatePicker 
                    selected={start_date} 
                    onChange={(date) => set_start_date(date)}                     
                />
            </div> 

            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="Address" 
                inputRef={ref_address_01}
                onChange={()=>update_data()}
                defaultValue={project_data.address_01}
            />
            <TextField  
                id="outlined-required" 
                label="Suite or Unit #" 
                inputRef={ref_address_02}
                onChange={()=>update_data()}
                defaultValue={project_data.address_02}
            />
            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="City" 
                inputRef={ref_city}
                onChange={()=>update_data()}
                defaultValue={project_data.city}
            />
            <TextField 
                required id="outlined-required" 
                label="State" 
                inputRef={ref_state}
                onChange={()=>update_data()}
                defaultValue={project_data.state}
            />
            <TextField 
                required 
                id="outlined-required" 
                label="Zip" 
                inputRef={ref_zip}
                onChange={()=>update_data()}
                defaultValue={project_data.zip}
            />
        </div>
            
            
      
    )
}

export default Project_Info
