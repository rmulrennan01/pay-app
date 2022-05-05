import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

//sov={sov_data} owner={owner_info} project={project_info} billing={billing_info}

function Confirmation_Modal(props) {
    return (
        <Paper>
            Please verify the information below prior to submission. 

            <Paper> 
                <h4> Draw Requests will be submitted to: </h4>
                
                {props.owner.owner_name}<br/> 
                
                {props.owner.owner_address_01} {props.owner.owner_address_02}<br/>
                {props.owner.owner_city}, {props.owner.owner_state} {props.owner.owner_zip} <br/>
                
            </Paper>
            <br/> 
            <Paper> 
                <h4> For this project: </h4>
                {props.project.project_name} <br/> 
                Contract #: {props.project.project_number}<br/> 
                {props.project.project_address_01} {props.project.project_address_02} <br/>
                {props.project.project_city}, {props.project.project_address_state} {props.project.project_address_zip}

            </Paper>
            <br/> 
            <Paper> 
                <h3> Schedule of Values </h3>
            </Paper>
            <Paper> 
                <h3> Billing </h3>
                Draw Requests are due on the <span></span> day of the month <br/> 
                Retainage will be: 
            </Paper>

            <Button> Submit </Button> 
        </Paper>
    )
}

export default Confirmation_Modal
