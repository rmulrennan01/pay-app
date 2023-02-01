import React, {useState, useEffect, useRef} from 'react';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'


import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import CurrencyFormat from 'react-currency-format';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TableSortLabel from '@mui/material/TableSortLabel';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';


function Change_order_table(props) {
    const [table_content, set_table_content] = useState([]);
    const [update, set_update] = useState(1); 
    const [total, set_total] = useState(props.contract_info.co_value); 
    const [direction, set_direction] = useState('desc'); 
    const [active_column, set_active_column] = useState(0); 
    const [triggered, set_triggered] = useState(false); 
    const [edit_index, set_edit_index] = useState(Number(-1)); 
    const [select_app, set_select_app] = useState('');
    const [select_desc, set_select_desc] = useState('');
    const [select_cost_code, set_select_cost_code] = useState('-'); 
    const currency_ref = useRef(); 

    useEffect(() => {
        compile_co(); 
        console.log('this is the sov', props.sov); 


    }, [])

    
    //BUILD JSON OBJECT FOR CO INFORMATION TO DISPLAY IN THE TABLE
    const compile_co = () => {
        let temp_co_list = []; 

        //Get all individual change orders
        for (let i=0; i<props.sov.length; i++){
            let sov_item = props.sov[i];
            let cost_code = sov_item.cost_code;
            let desc = sov_item.description;
            let id = sov_item.id; 

            if(sov_item.hasOwnProperty("change_orders") && sov_item.change_orders !=0){
                sov_item.change_orders.map( (item,index) => {
                  
                    item.cost_code = cost_code; 
                    item.cost_code_description = desc; 
                    item.id = id; 
                    item.internal_index = index; 
                    temp_co_list.push(item); 
                })
            }
        }

        //Default sort by pay_app
        temp_co_list.sort(function(a,b){
            let x = a["pay_app"];
            let y = b["pay_app"];
            if(x<y){
                return -1; 
            }
            if (x> y){
                return 1; 
            }
            return 0;
        }); 

        set_table_content(temp_co_list); 


    }

    //SORTING HELPER FUNCTION FOR WHEN USER CLICKS SORT BUTTONS ON COLUMNS
    const handle_sort = (index, key) => {
        direction=="asc"? set_direction("desc"):set_direction("asc")
        set_active_column(index); 

        let temp_data = table_content; 
        console.log("unsorted content", temp_data); 

        let multiplier = (direction == 'asc') ? 1 : -1; 
        
        temp_data.sort(function(a,b){
            let x = a[key];
            let y = b[key];
            if(x<y){
                return -1*multiplier; 
            }
            if (x> y){
                return 1*multiplier; 
            }
            return 0;
        }); 
        
        set_table_content(temp_data); 
       
    }



    const [delete_dialog_open, set_delete_dialog_open] = useState(false); 
    const [id, set_id] = useState(0); 
    const [internal_index, set_internal_index] = useState(0); 
    //DIALOG MODAL TO VERIFY THAT USER WANTS TO DELETE THE PAY APP FROM THE DATABASE
    const delete_dialog = () => {
     
        return(
            <Dialog
            open={delete_dialog_open}
            
            keepMounted
            onClose={()=>set_delete_dialog_open(false)}
            aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Are you sure?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    By clicking delete, this change order will be permanently deleted.
                    This action cannot be undone.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>set_delete_dialog_open(false)}>Cancel</Button>
                    <Button onClick={()=>props.delete_co(id,internal_index)}>Delete</Button>
                </DialogActions>
            </Dialog>
        )
    }



    const handle_delete_click = (sov_id, co_internal_index) =>{
        set_delete_dialog_open(true); 
        
        set_id(sov_id);
        set_internal_index(co_internal_index);   

    }

    //BUILDS LIST ITEMS FOR EDIT DROP DOWN
    const build_desc_list = (item) => {
        //TODO - FIX TO INCLUDE ALL COST - CODES THAT AREN'T CURRENTLY USED FOR A CO
        return(
            <MenuItem value={item.id}>{item.description}</MenuItem>
        )
    }

    const get_cost_code = (item) =>{
        console.log('item to review', item); 
        for (let i = 0; i<props.sov.length; i++){
            if(props.sov[i].id === item)
            {
                console.log('cc', item); 
                set_select_cost_code(props.sov[i].cost_code);
                break; 
            }

        }
    }


    const update_cost_code = (event: SelectChangeEvent) =>{
        console.log('here', event.target.value); 
        get_cost_code(String(event.target.value));
        set_select_desc(event.target.value); 
        
    }

    const select_desc_ref = useRef(); 
    const desc_drop_down = (index) =>{
        console.log('item', table_content[index])
        return(
        <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue= {select_desc}
        value={select_desc}
        onChange={update_cost_code}
        ref={select_desc_ref}
        sx={{width:140}}
        >
            {props.sov.map(build_desc_list)}
        </Select>
        )
    }



    //BUILDS LIST ITEMS FOR EDIT DROP DOWN
    const build_app_list = () => {
        let list = []; 
        for (let i=0; i<=props.contract_info.app_count; i++){
            list.push(String(i+1)); 
        }

        return list; 

    }


    const update_select_app = (event: SelectChangeEvent) =>{
        set_select_app(event.target.value); 
    }

    const select_app_ref = useRef(); 
    const app_drop_down = (index) =>{
        console.log('item', table_content[index])
        return(
        <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue= {select_app}
        value={select_app}
        onChange={update_select_app}
        ref={select_app_ref}
        sx={{width:140}}
        >
            {build_app_list().map((item)=>{return(<MenuItem value={item}>{item}</MenuItem> )})}
        </Select>
        )
    }

    
   
    const handle_edit_click = (index) =>{
        set_select_app(table_content[index].pay_app)
        set_select_desc(table_content[index].cost_code_description)
        set_edit_index(index);
    }


    //CONSTRUCTS TABLE ROWS
    const build_table_body = (item, index) => {
        console.log("line item added", item); 
        return(
        <TableRow key= {index}> 

            <TableCell> 
                {edit_index === index ?
                    <>{app_drop_down(index)}</>
                    :
                    <>{item.pay_app} </>
                }
            </TableCell>
            <TableCell>
                {edit_index === index ?
                    <>{select_cost_code}</>
                    :
                    <>{item.cost_code} </>
                }
            </TableCell>
            <TableCell>
                {edit_index === index ? 
                    <>{desc_drop_down(index)}</>
                    :
                    <>{item.description}</>
                }
            </TableCell>
            <TableCell>
              
                {edit_index === index ?
                <TextField 
                    inputRef={null} 
                    onChange={()=>console.log('hi')}
                    defaultValue={item.description}
                />
                    :
                    <>{item.description}</>
                }
                
            </TableCell>
            <TableCell>
                {edit_index === index ?
                                    
                    <CurrencyTextField
                    label="Amount"
                    variant="outlined"
                    value={item.value}
                    currencySymbol="$"
                    //minimumValue="0"
                    outputFormat="string"
                    decimalCharacter="."
                    digitGroupSeparator=","
                    ref = {currency_ref}
                    leadingZero={"deny"}
                    onChange={()=>set_total(Number(currency_ref.current.getValue()) + Number(props.contract_info.co_value) -Number(item.value))}
                  
                    />  
                    :
                    <CurrencyFormat value={item.value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>

                }
            </TableCell>
            <TableCell>
                {edit_index === index ?
                    <Tooltip title="Save Changes" color='primary'>
                        <Button onClick={()=>edit_index < 0 ? handle_edit_click(index) : set_edit_index(Number(-1))}>

                            Save Changes
                            
                        </Button>
                    </Tooltip>
                        :
                    <Tooltip title="Edit" color='primary'>
                        <IconButton onClick={()=>edit_index < 0 ? handle_edit_click(index) : set_edit_index(Number(-1))}>

                                <ModeEditIcon />
                            
                        </IconButton>
                    </Tooltip>
                }
            </TableCell>
            <TableCell>
                {edit_index === index ?
                    <Button onClick={()=>set_edit_index(-1)}> Cancel </Button>
                :
                    <Tooltip title="Delete">
                        <IconButton onClick={()=>handle_delete_click(item.id, item.internal_index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }
            </TableCell>

        </TableRow>
        )
    }

    //HEADER LABELS AND ASSOCIATED JSON KEYS FROM THE CHANGE ORDER OBJECT IN EACH SOV ITEM
    const headers = [
       
        {label:"Pay Period", key:"pay_app", width:100},
        {label: "Cost Code", key:"cost_code", width:200},
        {label: "Cost Code Description", key: "cost_code_description", width:150},
        {label: "Change Order Description", key:"description", width:350},
        {label: "Value", key: "value", width:150},
        ];

    const build_headers = (item, index) =>{
        return(
            <TableCell sx={{width:item.width}}>
                <TableSortLabel active={active_column == index ? true : false} direction={direction} onClick={()=>handle_sort(index,item.key)} className="Contract_browser__header_text">
                    <h3 style={{color:"black"}}> {item.label} </h3> 


                </TableSortLabel>
            </TableCell>
        )
    }




    return (
        <div> 
        
        {delete_dialog()}
     
        <TableContainer component={Paper} sx={{ minWidth: 100, maxWidth:1400 }}>
            <Table  aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        
                        {headers.map(build_headers)}
                        <TableCell sx={{width:25}}></TableCell>
                        <TableCell sx={{width:25}}></TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>

                    
                    {table_content === [] ? console.log("Loading table data") : table_content.map(build_table_body)}


                </TableBody>
                <TableFooter>
                    <TableRow>
                        
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell> <h3>Total</h3></TableCell>
                        <TableCell>
                            <h3>
                            {console.log('ref', currency_ref.current)}
                            <CurrencyFormat 
                                value={total} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                fixedDecimalScale={true} 
                                decimalScale={2}/>
                            </h3>

                        </TableCell>

                    </TableRow>
                </TableFooter>
            </Table>

        </TableContainer>
        

        </div>
    )
}

export default Change_order_table

