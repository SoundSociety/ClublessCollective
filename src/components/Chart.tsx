
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TicketsDrinksFoodChart({ data }: { data: { tickets: number; drinks: number; food: number } }){
  const chartData = {
    labels: ['Tickets', 'Drinks', 'Food'],
    datasets: [
      {
        label: 'Net Revenue',
        data: [data.tickets, data.drinks, data.food],
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(255,255,255,0.08)' } }
    }
  } as const;
  return (
    <div className="card p-4">
      <div className="section-title mb-2">Net by Stream</div>
      <Bar options={options} data={chartData} />
    </div>
  )
}
