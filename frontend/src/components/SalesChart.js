import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ predictions }) => {
  if (!Array.isArray(predictions) || predictions.length === 0) {
    return <p style={{ paddingLeft: "2rem" }}>No data available for chart.</p>;
  }

  const labels = predictions.map((item) =>
    item.store && item.family
      ? `Store ${item.store} - ${item.family}`
      : "Unknown"
  );

  const dataValues = predictions.map((item) =>
    typeof item.predicted_sales === "number" ? item.predicted_sales : 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Predicted Sales',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Predicted Sales per Store-Family'
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesChart;
