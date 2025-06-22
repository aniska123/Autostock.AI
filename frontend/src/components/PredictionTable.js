import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

const PredictionTable = ({ data }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
      <Typography variant="h6" style={{ padding: '1rem' }}>
        📋 Detailed Forecast Table
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Store #</strong></TableCell>
            <TableCell><strong>Product Category</strong></TableCell>
            <TableCell><strong>Forecasted Sales</strong></TableCell>
            <TableCell><strong>Current Stock</strong></TableCell>
            <TableCell><strong>Threshold (75%)</strong></TableCell>
            <TableCell><strong>Restock Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.store}</TableCell>
              <TableCell>{row.family}</TableCell>
              <TableCell>{row.predicted_sales}</TableCell>
              <TableCell>{row.current_stock}</TableCell>
              <TableCell>{row.threshold}</TableCell>
              <TableCell>{row.restock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PredictionTable;
