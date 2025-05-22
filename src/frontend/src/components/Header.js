import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Box from '@mui/material/Box';

const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsSoccerIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              letterSpacing: '.2rem',
            }}
          >
            NFL FANTASY DRAFT
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
