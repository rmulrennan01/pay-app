import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { flexbox } from '@mui/system';


function Footer() {
  return (
    <Box sx={{width:'100%', height:'350px', mt:'100px', backgroundColor:'#939496', padding:'20px'}}>
        <Grid container>
            <Grid item xs={12}>
                <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: 40,
                    letterSpacing: '.3rem',
                    color: 'white',
                    textDecoration: 'none',
                }}
                >
                    Appster
                </Typography>
                <br></br>
            </Grid>
            <Grid item xs={3} sx={{color:'white'}}>
                <h3> Our Solutions </h3>
                <div>
                    Estimating Tools (Coming soon)
                    <br></br><br></br>
                    Invoicing Utility (Coming soon)
                    <br></br><br></br>
                    Jobsite Tracking (Coming soon)

                </div>
            </Grid>    
            <Grid item xs={3} sx={{color:'white'}}>
                <h3>Resources</h3>
                <div>
                    Privacy Policy
                    <br></br><br></br>
                    Terms of use
                    <br></br><br></br>
                    Legal
                    <br></br><br></br>
                </div>
            </Grid>
            <Grid item xs={3} sx={{color:'white'}}>
            <h3>Company</h3>
                <div>
                    About
                    <br></br><br></br>
                    Careers
                    <br></br><br></br>                    
                    Newsfeed
                    <br></br><br></br>
                </div>
            </Grid>
            <Grid item xs={3} sx={{color:'white'}}>
            <h3>Contact</h3>
                <div>
                    1234 Example St
                    <br></br><br></br>
                    Minneapolis, MN 55413
                    <br></br><br></br>                    
                    info@example.com
                    <br></br><br></br>
                    1-800-000-0000
                    <br></br><br></br>
                </div>
            </Grid>
        </Grid>
        <Grid item xs={12} sx={{color:'white', display: "flex", flexDirection:'column', alignItems:'center'}}>
                <div sx={{textAlign:'center'}}>
                    Copyright 2022 Example Software, Inc. All rights reserved.
                </div>
        </Grid>
    </Box>
  )
}

export default Footer