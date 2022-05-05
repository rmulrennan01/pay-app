import React, {useState, useRef} from 'react'

import TextField from '@mui/material/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



/*
        project_name: "", 
        project_address_01: "", 
        project_address_02: "",
        project_city:"",
        project_state:"",
        project_zip:"",
        project_number:"", 
        project_date:"" 

*/

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
                project_name: ref_name.current.value, 
                project_address_01: ref_address_01.current.value, 
                project_address_02: ref_address_02.current.value,
                project_city:ref_city.current.value,
                project_state:ref_state.current.value,
                project_zip:ref_zip.current.value,
                project_number:ref_number.current.value,
                project_date:start_date
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
                defaultValue={project_data.project_name}
            />
            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="Contract ID" 
                inputRef={ref_number}
                onChange={()=>update_data()}
                defaultValue={project_data.project_number}
            />
            <br/><br/>
            Contract Date:  <br/>
            <DatePicker 
                selected={start_date} 
                onChange={(date) => set_start_date(date)} 
                

                
            /> 

            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="Address" 
                inputRef={ref_address_01}
                onChange={()=>update_data()}
                defaultValue={project_data.project_address_01}
            />
            <TextField  
                id="outlined-required" 
                label="Suite or Unit #" 
                inputRef={ref_address_02}
                onChange={()=>update_data()}
                defaultValue={project_data.project_address_02}
            />
            <br/><br/>
            <TextField 
                required 
                id="outlined-required" 
                label="City" 
                inputRef={ref_city}
                onChange={()=>update_data()}
                defaultValue={project_data.project_city}
            />
            <TextField 
                required id="outlined-required" 
                label="State" 
                inputRef={ref_state}
                onChange={()=>update_data()}
                defaultValue={project_data.project_state}
            />
            <TextField 
                required 
                id="outlined-required" 
                label="Zip" 
                inputRef={ref_zip}
                onChange={()=>update_data()}
                defaultValue={project_data.project_zip}
            />
        </div>
            
            
      
    )
}

export default Project_Info
