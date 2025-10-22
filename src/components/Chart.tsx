import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TicketsDrinksFoodChart({
  data
}: {
  data: { tickets: number; drinks: number; food: number }
}) {
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand-rgb').trim() || '168,85,247';
  const border = `rgb(${brand})`;
  const fill = `rgba(${brand},0.85)`;
  const hover = `rgba(${brand},1)`;

  const chartData = {
    labels: ['Tickets', 'Drinks', 'Food'],
    datasets: [
      {
        label: 'Net Revenue',
        data: [data.tickets, data.drinks, data.food],
        backgroundColor: fill,
        borderColor: border,
        borderWidth: 2,
        hoverBackgroundColor: hover,
        hoverBorderColor: hover,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { mode: 'index' as const, intersect: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.9)' } },
      y: { grid: { color: 'rgba(255,255,255,0.18)' }, ticks: { color: 'rgba(255,255,255,0.9)' } }
    }
  } as const;

  return (
    <div className="card p-4 border border-white/10">
      <div className="section-title mb-2">Net by Stream</div>
      <div className="h-56 md:h-64">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
