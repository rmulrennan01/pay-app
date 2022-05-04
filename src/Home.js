import React from 'react';
import "./Home.css"

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

function Home() {
    return (
        <div>
            <Paper className="home__info__tile"> 
                Welcome to the payment application manager. Here you can manage all of your payment applications without the need
                of all those pesky spreadsheets. 
            </Paper>
            <br/><br/><br/>
           

            <Button variant="contained">Setup a new project</Button>
        </div>
    )
}

export default Home
