
import React, {useState,useRef} from 'react';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

//modal
import Modal from '@mui/material/Modal'; 

//Forms
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';

//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';






function Schedule_of_Values(props) {
    const [table_content, set_table_content] = useState(props.sov_data);
    const [update, set_update] = useState(1); 
    const [total, set_total] = useState(0); 

    const ref_cost_code = useRef(); 
    const ref_description = useRef(); 
    const ref_value = useRef(); 

    const build_table_body = (item,index) => {
      
            return(
                <TableRow> 
                    <TableCell>
                        {item.cost_code}
                    </TableCell>
                    <TableCell>
                        {item.description}
                        
                    </TableCell>
                    <TableCell>
                        {item.value}
                    </TableCell>
                    <TableCell>
                        <Button onClick={()=>remove_table_item(index)}> Remove </Button>
                    </TableCell>
                </TableRow>
            );
    }

    const update_table = () => {
        let temp_data = table_content;
        temp_data.push(
            {
            cost_code:ref_cost_code.current.value, 
            description:ref_description.current.value,
            value:ref_value.current.value
            }
            ); 
        //props.update_sov(temp_data); 
        set_table_content(temp_data); 
        props.update_sov(temp_data); 
        //set_update(update*-1)
        set_total(Number(total)+Number(ref_value.current.value)); 
        console.log("Added :" + temp_data[0]);
        
    }

    const remove_table_item = (i) => {
        let temp_data = table_content;
        let temp_val = table_content[i].value
        temp_data.splice(i,1); 
        set_table_content(temp_data); 
        props.update_sov(temp_data); 
        //set_update(update*-1); 
        set_total(Number(total)-Number(temp_val));


    }

   


    return (
        <div> 
        Define the cost categories for how you will bill your project. 
        The total cost for these items should match your total contract amount.
        You must include at least one cost item. All future adjustments to your contract
        will be through change orders that you can append to one of these cost items. Cost codes do not need to be
        unique. 
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        <TableCell>
                            Cost Code
                        </TableCell>
                        <TableCell>
                            Description
                        </TableCell>
                        <TableCell>
                            Value ($)
                        </TableCell>
                        <TableCell>

                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(table_content.length == 0) ? null : table_content.map(build_table_body)}
                    <TableRow> 
                        
                        <TableCell> 
                            <TextField required inputRef={ref_cost_code} id="outlined-required" label="Cost Code" inputProps={{maxLength:15}}>

                            </TextField>
                        </TableCell>
    
                        <TableCell> 
                            <TextField required inputRef={ref_description} id="outlined-required" label="Description" inputProps={{maxLength:35}}>
                                
                            </TextField>    
                        </TableCell>
                        <TableCell> 
                            <TextField required inputRef={ref_value} id="outlined-required" label="Cost" type="number">
                                
                            </TextField>   
                        </TableCell>
                        <TableCell>
                            <Button onClick={()=>update_table()}>Add</Button> 
                        </TableCell>
                    </TableRow>
        
                </TableBody>
            </Table>

        </TableContainer>
        
        Contract Total: $ {total}

       

     


        </div>
    )
}

export default Schedule_of_Values
