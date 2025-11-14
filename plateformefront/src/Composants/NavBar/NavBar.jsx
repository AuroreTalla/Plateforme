import React from 'react';
import { AppBar, Toolbar, Avatar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const NavBar = () => {

  const navigate = useNavigate();

  const allerVersInscription = () => {
    navigate("inscription")  };

  return (
      <AppBar position="fixed" color="inherit" elevation={1} className="navbar">
        
        <Toolbar className="barre-menu-toolbar">
            
          <Box className="barre-menu-left">

                <Avatar className="barre-menu-avatar">PC</Avatar>
                <Typography variant="h6" component="div" className="barre-menu-nom">PrepaConcours</Typography>
          </Box>
       
          <Box className="barre-menu-right">

            <Link to="apropos" className="lien-menu">A propos</Link>

            <Button variant="contained" size="small" className="barre-menu-button" onClick={allerVersInscription}  >S'inscrire</Button>
          </Box>

        </Toolbar>
      </AppBar>
  );
};

export default NavBar;