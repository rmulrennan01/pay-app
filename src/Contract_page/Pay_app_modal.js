import React, {useState, useEffect, useRef} from 'react'
import Paper from '@mui/material/Paper';
import Pay_app_modal_table from './Pay_app_modal_table.js'; 
import {useParams} from "react-router-dom";
import Date_string from '../Utilities/Date_string.js'; 

import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';



function Pay_app_modal(props) {
    
    const [sov, set_sov] = useState(props.sov_data); 
    const [edit_mode, set_edit_mode] = useState(false); 
    const {id} = useParams();
    const [contract_info, set_contract_info] = useState(props.contract_info); 
    const [saved_inputs, set_saved_inputs] = useState([]);  
    const [this_draw_total, set_this_draw_total] = useState(0); 
    const [app_id, set_app_id] = useState(Number(props.pay_app_id)); 
    const [trigger, set_trigger] = useState(true); 



    

    /*
    useEffect(() => {
        set_sov(props.sov); 
        set_app_id(Number(props.pay_app_id)); 
        set_contract_info(props.contract_info); 

    }, [])
    */
    
    const update_billed_to_date = (inputs) =>{
        set_saved_inputs(inputs); 
        let temp = 0; 
        
        inputs.map((item) => temp += Number(item));        
        set_this_draw_total(temp)
    }
 



    const open_pdf = () => {
        let new_tab = window.open('about:blank',"_blank"); 
        new_tab.location = ('/pdf/'+ String(id)+ '/' + String(app_id+1)+'/' + "false"); 

    }

  

    const edit_button = () => {
        if (edit_mode){
            return(
                <Button variant="contained" onClick={()=>set_submit_dialog_open(true)} startIcon={<SaveIcon/>}> Save & Submit </Button>
            );
        }
        else if (!edit_mode && app_id+1 == contract_info.app_count){
            return( 
                <Button startIcon={<EditIcon/>} variant="contained" onClick={()=>set_edit_dialog_open(true)}> Edit </Button>
            );
        }

        return(
            <Button startIcon={<EditIcon/>} variant="contained" disabled={true} onClick={()=>alert("Only the most recent payment application can be edited. To edit this application, all subsequent applications need to be deleted.")}> Edit </Button>
        )

    }

    const delete_btn = () => {
        if(Number(app_id)+1 == contract_info.app_count){
            return (
                <Button variant='contained' startIcon={<DeleteIcon />} onClick={()=>set_delete_dialog_open(true)}> Delete </Button>
            )
        }
        else {
            return(
                <Button variant='contained' startIcon={<DeleteIcon />} disabled={true} > Delete </Button>
            ); 
        }
    }

    const prev_btn = () =>{
        return(
            <Button variant='contained' startIcon={<KeyboardArrowLeftIcon/>} disabled={app_id == 0 ? true : false} onClick={()=>handle_prev_click()}>Prev</Button>
        )
    }

    const next_btn = () =>{
        return(
            <Button endIcon={<KeyboardArrowRightIcon/>} disabled={app_id+1 == Number(contract_info.app_count) ? true : false} onClick={()=>handle_next_click()} variant='contained' > Next</Button>
        )
    }






    const handle_prev_click = () => {
        console.log(app_id); 
        if(Number(app_id) > 0){
            set_app_id(app_id-1); 
            set_trigger(!trigger); 
            console.log("CLICKED")
        }
    }

    const handle_next_click = () =>{
        if(Number(app_id)+1 < contract_info.app_count){
            set_app_id(app_id+1); 
        }

    }

    const enable_edit_mode = () =>{
        set_edit_dialog_open(false); 
        set_edit_mode(true); 

    }

    const [edit_dialog_open, set_edit_dialog_open] = useState(false); 
    //DIALOG MODAL FOR EDITING PAY APP
    const edit_dialog = () => {
        return(
            <Dialog
            open={edit_dialog_open}
            
            keepMounted
            onClose={()=>set_edit_dialog_open(false)}
            aria-describedby="alert-dialog-slide-description"
            >
            <DialogTitle>{"You are about to edit an existing application"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                By clicking ok, you will be able to edit the most recent payment application.
                To edit prior applications, the most recent application must be deleted.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>set_edit_dialog_open(false)}>Cancel</Button>
                <Button onClick={()=>enable_edit_mode()}>Ok</Button>
            </DialogActions>
            </Dialog>
        )
    }


    const submit_changes = () => {
        if(saved_inputs.length ==0){
            let temp_array = new Array(sov.length).fill(0); 
            props.submit(temp_array); 
        }
        else{
            props.submit(saved_inputs); 
        }
    }

    
    const [submit_dialog_open, set_submit_dialog_open] = useState(false); 
    //DIALOG MODAL TO SHOW WHEN USER CLICKS SUBMIT FOR EDITS ON THE MOST RECENT PAYMENT APPLICATION
    const submit_dialog = () => {
        return(
            <Dialog
            open={submit_dialog_open}
            
            keepMounted
            onClose={()=>set_submit_dialog_open(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Submit to database?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                By clicking submit, the changes made to this payment application
                will replace the existing application. These changes cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>set_submit_dialog_open(false)}>Cancel</Button>
                <Button onClick={()=>submit_changes()}>Submit</Button>
            </DialogActions>
          </Dialog>
        )
    }

    const [delete_dialog_open, set_delete_dialog_open] = useState(false); 
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
                By clicking delete, this payment application will be permanently deleted.
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>set_delete_dialog_open(false)}>Cancel</Button>
                <Button onClick={()=>props.delete_pay_app()}>Delete</Button>
            </DialogActions>
          </Dialog>
        )
    }
    

 

    return (
            //path='/pay_app/pdf/:id/:app_id' 
       
            <div >
                {submit_dialog()}
                {delete_dialog()}
                {edit_dialog()}
                <Paper sx={{padding:2}}> 
                    <h2>Pay App # {app_id+1} </h2> 
                    <h2>Application Date: {Date_string(contract_info.pay_app_dates[app_id])}</h2> 
                    
                    <br></br>
                    <Button variant='contained' startIcon={<PictureAsPdfIcon/>} onClick={()=>open_pdf()}>View PDF</Button> {edit_button()} {delete_btn()}      
                            
                    <Pay_app_modal_table
                        key = {app_id}
                        sov_data={sov} 
                        pay_app_id={app_id}
                        edit_mode={edit_mode}
                        contract_info={contract_info}
                        saved_inputs={(item)=>set_saved_inputs(item)}
                        submit_changes = {submit_changes}
                    /> 
                    <br></br>
                    {prev_btn()} {next_btn()} 

                </Paper>
                
            </div>
            
        
        
    )
}

export default Pay_app_modal
