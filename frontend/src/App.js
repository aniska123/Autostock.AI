import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Grid, CircularProgress, Box } from '@mui/material';
import Header from './components/header';
import PredictionCard from './components/PredictionCard';
import SalesChart from './components/SalesChart';
import PredictionTable from './components/PredictionTable';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict-sales', {
        data: [
          {
            store_nbr: 1,
            family: 'BEVERAGES',
            historical_data: Array.from({ length: 30 }, (_, i) => ({
              date: `2025-05-${String(i + 1).padStart(2, '0')}`,
              sales: 100 + i,
              onpromotion: i % 2,
            })),
          },
          {
            store_nbr: 2,
            family: 'DAIRY',
            historical_data: Array.from({ length: 30 }, (_, i) => ({
              date: `2025-05-${String(i + 1).padStart(2, '0')}`,
              sales: 90 + i,
              onpromotion: (i + 1) % 2,
            })),
          },
        ],
      });

      const parsed = response.data.results.map((item, idx) => ({ id: idx, ...item }));
      setPredictions(parsed);
      await axios.post('http://127.0.0.1:5000/save-predictions', { results: parsed });
    } catch (err) {
      alert('❌ Error while fetching');
      console.error(err);
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    window.open('http://127.0.0.1:5000/download-predictions', '_blank');
  };

  return (
    <>
      <Header />
      <Container>
        <Box mt={4} mb={2} sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch & Save'}
          </Button>
          <Button
            variant="outlined"
            onClick={downloadCSV}
            disabled={predictions.length === 0}
          >
            Download CSV
          </Button>
        </Box>

        <Grid container spacing={2}>
          {predictions.map((item) => (
            <Grid item key={item.id}>
              <PredictionCard
                store={item.store}
                category={item.family}
                prediction={item.predicted_sales}
              />
            </Grid>
          ))}
        </Grid>

        {predictions.length > 0 && (
          <>
            <Box mt={4}><SalesChart predictions={predictions} /></Box>
            <Box mt={4}><PredictionTable data={predictions} /></Box>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
