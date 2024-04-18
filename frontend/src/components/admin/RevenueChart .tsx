import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { axiosInstanceAdmin } from '../../Api/axiosinstance';





interface RevenueData {
  date: string;
  revenue: number;
}

const RevenueChart: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
   
   await axiosInstanceAdmin.get('/getall-payment-details').then((response) => {
    setRevenueData(response.data.payment.result);
   });
  };

  useEffect(() => {
    if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy previous chart instance
      }
      
    renderChart();
  }, [revenueData]);

  const renderChart = () => {
    const ctx = document.getElementById('revenue-chart') as HTMLCanvasElement;
    if (!ctx) return;

    const dates = revenueData.map(data => data.date);
    const revenues = revenueData.map(data => data.revenue);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Revenue',
          data: revenues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Revenue Chart</h2>
      <canvas id="revenue-chart" width={400} height={200}></canvas>
    </div>
  );
};

export default RevenueChart;
