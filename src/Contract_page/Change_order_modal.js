import React, {useState, useRef} from 'react'
import Paper from '@mui/material/Paper';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';


function Change_order_modal(props) {
  const [cost_codes, set_cost_codes] = useState(props.sov_data); 
  const [cost_code_selection, set_cost_code_selection] = useState(""); 
  const [value, set_value] = useState(0); 

  const selectionRef= useRef(); 
  const valueRef = useRef(); 
  const descripRef= useRef(); 


  const update_cost_code = (event: SelectChangeEvent) =>{
    set_cost_code_selection(event.target.value); 
    alert(event.target.value); 

  }

  const submit_change_order = () => {
   //console.log({description:descripRef.current.value, value: value})
   let tempData = {description:descripRef.current.value, value: value}; 

   props.submit(cost_code_selection, tempData); 

  }


  

  const buildList = (item) => {
    return(
        <MenuItem value={item.id}>{item.cost_code + " " + item.description}</MenuItem>
    )

}

  return (
    <Paper> 
      <h3> Add a Change Order</h3>
      <br/> 
      What's the net change in contract value?<br/> 
      <br/> 
      <CurrencyTextField
        label="Amount"
        variant="outlined"
        value={value}
        currencySymbol="$"
        //minimumValue="0"
        outputFormat="string"
        decimalCharacter="."
        digitGroupSeparator=","
        
        leadingZero={"deny"}
        ref={valueRef}
        onChange={(event, value)=> set_value(value)}

      />

      <br/> <br/> 
      Apply the change order to this cost item:<br/> 
      <br/> 
      <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue= "-----"
                value={cost_code_selection}
                onChange={update_cost_code}
                ref={selectionRef}
            >
                {cost_codes.map(buildList)}
      </Select>
      <br/> 
      What's the brief description for this change order?<br/> 
      <br/> 
      <TextField 
                required 
                inputRef={descripRef} 
                id="outlined-required" 
                label="" 
                
                defaultValue={""}
      />
      <br/> <br/> 
      <Button variant="contained" onClick={()=>submit_change_order()}>Add to Contract</Button> <Button variant="outlined" onClick={()=>props.close_modal()}>Cancel</Button> 



    </Paper>
  )
}

export default Change_order_modal