import React, {useState} from 'react'; 

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';


function Change_orders(props) {
    const [modal_open, set_modal_open] = useState(false); 
    const [cost_item, set_cost_item] = useState(""); 
    const buildList = (item) => {
        return(
            <MenuItem value={item.description}>{item.description}</MenuItem>
        )

    }
    return (
        <div>
            <Modal open={modal_open} onClose={()=>set_modal_open(false)} >
                <Paper>
                    What cost item do you want the change order to be applied to?
                    <br/> 
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue= ""
                        value={cost_item}
                        onChange={(event: SelectChangeEvent)=>set_cost_item(event.target.value)}
                     
                    >
                        {props.sov.map(buildList)}
                    </Select> 
                    <br/> 
                    Change Order Value: <br/> 
                    <TextField 
                        required 
                        id="outlined-required" 
                        label="Amount ($)" 

                    />
                    <br/><br/>
                    Notes:<br/> 
                    <TextField 
                        required 
                        
                        

                    />
                    <br/><br/>

                    <Button variant="contained"> Add </Button>
                    <Button variant="outlined" onClick={()=> set_modal_open(false)}> Cancel </Button>
                    
                
                </Paper> 
            </Modal>
            Please an change orders that have been approved for this period.
            <br/> 
            <Button variant="contained" onClick={()=> set_modal_open(true)} > Add Change Order </Button>
            
        </div>
    )
}

export default Change_orders
