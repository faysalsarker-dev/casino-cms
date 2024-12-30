import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './../../hooks/useAxiosSecure/useAxiosSecure';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const response = await axiosSecure.get(`/dashboard`);
      return response.data;
    },
  });

  const { totalUsers, totalDeposit, totalWithdraw, totalSupport, users } = data || {};
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Deposits',
        data: data.deposits.map((d) => d.count),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Withdrawals',
        data: data.withdraws.map((w) => w.count),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
    ],
  };

  const lineChartData = (label, data, borderColor, bgColor) => ({
    labels,
    datasets: [
      {
        label,
        data: data.map((d) => d.count),
        borderColor,
        backgroundColor: bgColor,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
      },
    ],
  });

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{totalDeposit}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{totalWithdraw}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Total Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600">{totalSupport}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Bar Chart - Multiple */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Deposits & Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barChartData} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Line Chart - Monthly Users Growth */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Monthly Users Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={lineChartData('Users', users, 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.3)')} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Line Chart - Support Requests */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Support Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={lineChartData('Support Requests', data.supports, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.3)')} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Line Chart - Deposits Trend */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Deposits Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={lineChartData('Deposits', data.deposits, 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.3)')} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
