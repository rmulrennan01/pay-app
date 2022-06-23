import React from 'react';
import Paper from '@mui/material/Paper';

import './Page_G702.css'; 


function Page_G702(props) {
    return (
        <div>
            <div className="page_G702__top">
                <Paper className="page_G702__top__child">
                    <h4>To Owner:</h4>

                    <h4>From Contractor:</h4>
                    
                </Paper>
                <Paper className="page_G702__top__child">
                    <h4>Project:</h4>
                    
                </Paper>
                <Paper className="page_G702__top__child">
                    <h4>Application #:</h4>
                    <h4>Period To:</h4>

                    <h4>Contract Date:</h4>

                    <h4>Contract ID:</h4>

                </Paper>

                <Paper className="page_G702__top__child"> 
                    <h4> Distribution to: </h4>
                    [_] Owner:                   <br/>
                    [_] Architect:              <br/>
                    [X] General Contractor:      <br/>
                    [_] Owners Representative:   <br/>
                </Paper>
            </div> 
            
        </div>
    )
}

export default Page_G702
