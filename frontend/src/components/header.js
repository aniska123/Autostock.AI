import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2';

const Header = () => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <InventoryIcon sx={{ mr: 1 }} />
      <Typography variant="h6" component="div">
        AutoStock.AI – Smart Inventory Forecasting
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
