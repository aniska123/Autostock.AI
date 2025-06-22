import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

const ForecastResult = ({ forecastData }) => {
  const [restockData, setRestockData] = useState([]);

  useEffect(() => {
    if (forecastData && forecastData.length > 0) {
      const formattedData = forecastData.map((item) => ({
        store: item.store_nbr,
        category: item.family,
        predicted_sales: item.predicted_sales,
        current_stock: 10000, // Optional default
        reorder_threshold: 0.75 * item.predicted_sales,
      }));

      axios
        .post("http://localhost:5000/restock-suggestions", formattedData)
        .then((response) => {
          setRestockData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching restock suggestions:", error);
        });
    }
  }, [forecastData]);

  const chartData = {
    labels: forecastData.map((item) => `Store ${item.store_nbr} - ${item.family}`),
    datasets: [
      {
        label: "Predicted Sales",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: forecastData.map((item) => item.predicted_sales),
      },
    ],
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        📊 Predicted Sales per Store-Family
      </Typography>

      <Bar data={chartData} />

      <Box mt={4}>
        <Paper elevation={3}>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              📋 Detailed Forecast Table
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Store #</strong></TableCell>
                    <TableCell><strong>Product Category</strong></TableCell>
                    <TableCell><strong>Forecasted Sales</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forecastData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.store_nbr}</TableCell>
                      <TableCell>{item.family}</TableCell>
                      <TableCell>{item.predicted_sales}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>

      <Box mt={4}>
        <Paper elevation={3}>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              ✅ Live Restock Suggestions
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Store #</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>Predicted Sales</strong></TableCell>
                    <TableCell><strong>Current Stock</strong></TableCell>
                    <TableCell><strong>Reorder Threshold</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restockData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.store}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.predicted_sales}</TableCell>
                      <TableCell>{item.current_stock}</TableCell>
                      <TableCell>{item.reorder_threshold}</TableCell>
                      <TableCell
                        style={{
                          color: item.restock_status === "Restock Needed" ? "red" : "green",
                          fontWeight: "bold",
                        }}
                      >
                        {item.restock_status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ForecastResult;
