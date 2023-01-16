import React, {useState, useEffect} from 'react';


import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import CurrencyFormat from 'react-currency-format';


//Tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TableSortLabel from '@mui/material/TableSortLabel';

import DeleteIcon from '@mui/icons-material/Delete';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function Change_order_table(props) {
    const [table_content, set_table_content] = useState([]);
    const [update, set_update] = useState(1); 
    const [total, set_total] = useState(0); 
    const [direction, set_direction] = useState('desc'); 
    const [active_column, set_active_column] = useState(0); 
    const [triggered, set_triggered] = useState(false); 



    useEffect(() => {
        compile_co(); 
        
       
     
        //handle_sort(0,"pay_app");
        //Default Sort by Pay Period
       // set_triggered(!triggered); 
        //set_triggered(!triggered); 

    }, [])


    
    
   
    

    //BUILD JSON OBJECT FOR CO INFORMATION TO DISPLAY IN THE TABLE
    const compile_co = () => {
        let temp_co_list = []; 

        //Get all individual change orders
        for (let i=0; i<props.sov.length; i++){
            let sov_item = props.sov[i];
            let cost_code = sov_item.cost_code;
            let id = sov_item.id; 

            if(sov_item.hasOwnProperty("change_orders") && sov_item.change_orders !=0){
                sov_item.change_orders.map( (item,index) => {
                  
                    item.cost_code = cost_code; 
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


    //CONSTRUCTS TABLE ROWS
    const build_table_body = (item, index) => {
        console.log("line item added", item); 
        return(
        <TableRow key= {index}> 
            <TableCell>
                {item.pay_app}
            </TableCell>
            <TableCell>
                {item.cost_code}
            </TableCell>
            <TableCell>
                {item.description}
                
            </TableCell>
            <TableCell>
                <CurrencyFormat value={item.value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
            
            </TableCell>
            <TableCell>
                <Button startIcon={<DeleteIcon/>} onClick={()=>handle_delete_click(item.id, index)}> </Button>
            </TableCell>

        </TableRow>
        )


    }

    //HEADER LABELS AND ASSOCIATED JSON KEYS FROM THE CHANGE ORDER OBJECT IN EACH SOV ITEM
    const headers = [
        {label:"Pay Period", key:"pay_app"},
        {label: "Cost Code", key:"cost_code"},
        {label: "Description", key:"description"},
        {label: "Value", key: "value"},
        ];

    const build_headers = (item, index) =>{
        return(
            <TableCell >
                <TableSortLabel active={active_column == index ? true : false} direction={direction} onClick={()=>handle_sort(index,item.key)} className="Contract_browser__header_text">
                    <h3 style={{color:"black"}}> {item.label} </h3> 


                </TableSortLabel>
            </TableCell>
        )
    }



 



    return (
        <div> 
        
        {delete_dialog()}
     
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} aria-label="simple table">
                <TableHead> 
                    <TableRow>
                        {headers.map(build_headers)}
                        <TableCell></TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>

                    
                    {table_content === [] ? console.log("Loading table data") : table_content.map(build_table_body)}


                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell> <h3>Total</h3></TableCell>
                        <TableCell>
                            <h3>
                            <CurrencyFormat value={props.contract_info.co_value} displayType={'text'} thousandSeparator={true} prefix={'$'} fixedDecimalScale={true} decimalScale={2}/>
                            </h3>

                        </TableCell>

                    </TableRow>
                </TableFooter>
            </Table>

        </TableContainer>
        
        Change Order Total: $ {total}

        </div>
    )
}

export default Change_order_table

