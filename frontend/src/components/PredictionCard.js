import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const PredictionCard = ({ store, category, prediction }) => (
  <Card sx={{ minWidth: 250, m: 1, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="subtitle1" color="text.secondary">
        Store #{store}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {category}
      </Typography>
      <Typography variant="body1" color="primary">
        Predicted Sales: {prediction}
      </Typography>
    </CardContent>
  </Card>
);

export default PredictionCard;
