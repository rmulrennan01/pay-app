
import React, {useState} from 'react';
import "./Navbar.css";
import {Link, AppBar, List, Toolbar, Button, Container, Avatar, Hidden, SwipeableDrawer, ListItem} from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import {logOut} from './Firebase.js'; 
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { createTheme, createMuiTheme } from "@mui/material";

import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';

import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';

function Navbar() {
    const [showMenu, set_showMenu] = useState(false); 
    const location = useLocation();

    /*
    return (
        <>  
        {
            location.pathname === '/login/'
            ?
            <></>
            :
            <div>
            <AppBar className='Navbar__AppBar' position='relative'> 
                <Container maxWidth="md"> 
                    <Toolbar  disableGutters> 
                    <Avatar variant="square" className='Navbar__Logo'> Pay App</Avatar>

                    <Hidden xsDown>
                        
                            <Link className='Navbar__Button' href="/" underline="none">Dashboard</Link> 
                            <Link className='Navbar__Button' href="/contract_browser" underline="none"> Contracts </Link> 
                            <Link className='Navbar__Button' href="/job_setup"  underline="none">New Job</Link> 
                            <Link className='Navbar__Button'  underline="none">About</Link> 
                            <Button onClick={logOut}>Log Out</Button>
                        
                        
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
                            <Link className='Navbar_Button' href="/contract_browser" underline="none"> Contracts </Link> 
                        </ListItem> 
                        <ListItem>
                            <Link className='Navbar__Button' href="/job_setup"  underline="none">Job Setup</Link> 
                        </ListItem>
                        <ListItem>
                            <Button onClick={logOut}>Log Out</Button>
                        </ListItem>
    
        
                    
                        
                    </List>


                </SwipeableDrawer>
            </AppBar>

        </div>
        }
    </>
)
*/
//const pages = ['Dashboard', 'Contract Browser', 'Add Contract'];
const pages = [
    {label: 'Dashboard', link:'/'},
    {label:'Contract Browser', link:'/contract_browser'},
    {label: 'New Contract', link: '/job_setup' }];


const settings = ['Account', 'Logout'];
const [anchorElNav, setAnchorElNav] = React.useState(null);
const [anchorElUser, setAnchorElUser] = React.useState(null);

const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorElNav(event.currentTarget);
};
const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorElUser(event.currentTarget);
};

const handleCloseNavMenu = () => {
  setAnchorElNav(null);
};

const handleCloseUserMenu = () => {
  setAnchorElUser(null);
};

/*
const theme = createTheme({
    palette: {
      primary: '#1565C0',
      secondary: '#FFFFFF'
    }
  });
*/

const theme = createMuiTheme({
    overrides: {
      MuiButton: {
        label: {
          color: "#ffffff",
        },
      },
    }});
  

return (
    <>{

    
    location.pathname === '/login/'
    ?
    <></>
    :
    <AppBar position="static" style={{ background: '#1565C0' }}>
        <Container maxWidth="xl">
        <Toolbar disableGutters >
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
                letterSpacing: '.3rem',
                color: 'white',
                textDecoration: 'none',
            }}
            >
            Appster
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="white"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                display: { xs: 'block', md: 'none' },
                }}
            >
                {pages.map((page) => (
                <MenuItem key={page.label} onClick={()=>window.location=page.link}>
                    <Typography textAlign="center"  >{page.label}</Typography>
                </MenuItem>
                ))}
            </Menu>
            </Box>
            <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'white',
                textDecoration: 'none',
            }}
            >
            Appster
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
                <div
                    key={page.label}
                    onClick={()=>window.location=page.link}
                    sx={{ my: 2, display: 'block' }}
                    
                   
                    
                >
                    {page.label} 
                </div>
            ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem key={'settings'} onClick={()=>window.location='/account'}>
                    <Typography textAlign="center">Account</Typography>
                </MenuItem>
                <MenuItem key={'logout'} onClick={()=>logOut()}>
                    <Typography textAlign="center">Logout</Typography>
                </MenuItem>
                
            </Menu>
            </Box>
        </Toolbar>
        </Container>
    </AppBar>
    }
    </>
);
    
}

export default Navbar
