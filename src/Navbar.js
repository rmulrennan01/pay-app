
import React, {useState} from 'react';
import "./Navbar.css";
import {Link, AppBar, List, Toolbar, Button, Container, Avatar, Hidden, SwipeableDrawer, ListItem} from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

function Navbar() {
    const [showMenu, set_showMenu] = useState(false); 

    return (
        <div>
        <AppBar className='Navbar__AppBar' position='relative'> 
            <Container maxWidth="md"> 
                <Toolbar  disableGutters> 
                <Avatar variant="square" className='Navbar__Logo'> Pay App</Avatar>

                <Hidden xsDown>
                    
                        <Link className='Navbar__Button' href="/" underline="none">Home</Link> 
                        <Link className='Navbar__Button' href="/job_setup"  underline="none">Projects</Link> 
                        <Link className='Navbar__Button'  underline="none">Applications</Link> 
                        <Link className='Navbar__Button'  underline="none">About</Link> 
                    
                    
                </Hidden>
                <Hidden smUp>
                    <IconButton onClick={()=>set_showMenu(true)}>
                        <MenuIcon />
                    </IconButton>

                </Hidden>
                </Toolbar>
            </Container>
            <SwipeableDrawer open={showMenu} onOpen={() => set_showMenu(true)} onClose={() => set_showMenu(false)} anchor="top">
                <Link onClick={()=>set_showMenu(false)} className='Navbar__Button' underline="none"> Close </Link>
                <List>
                    <ListItem>
                        <Link className='Navbar__Button' href="/" underline="none">Home</Link> 
                        
                    </ListItem>
                    <ListItem>
                        <Link className='Navbar__Button' href="/job_setup"  underline="none">Job Setup</Link> 
                    </ListItem>
                    <ListItem>
                        <Link className='Navbar__Button' href="/Products"  underline="none">Inspiration</Link> 
                    </ListItem>
                 
                    
                </List>


            </SwipeableDrawer>
        </AppBar>

    </div>
)
    
}

export default Navbar
