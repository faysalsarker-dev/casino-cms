import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const { data:info, isLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const response = await axiosSecure.get(`/dashboard`);
      return response.data;
    },
  });
  const data = {
    totalUsers: 1234,
    totalDeposit: 567890,
    totalWithdraw: 345678,
    totalSupport: 89,
    users: [
      { month: "Jan", count: 100 },
      { month: "Feb", count: 1850 },
      { month: "Mar", count: 200 },
      { month: "Apr", count: 2350 },
      { month: "May", count: 300 },
      { month: "Jun", count: 3950 },
    ],
    deposits: [
      { month: "Jan", count: 50000 },
      { month: "Feb", count: 595000 },
      { month: "Mar", count: 68000 },
      { month: "Apr", count: 644000 },
      { month: "May", count: 800 },
      { month: "Jun", count: 75000 },
    ],
    withdraws: [
      { month: "Jan", count: 30000 },
      { month: "Feb", count: 35000 },
      { month: "Mar", count: 40000 },
      { month: "Apr", count: 45000 },
      { month: "May", count: 50000 },
      { month: "Jun", count: 55000 },
    ],
    supports: [
      { month: "Jan", count: 180 },
      { month: "Feb", count: 1452 },
      { month: "Mar", count: 156 },
      { month: "Apr", count: 2450 },
      { month: "May", count: 2554 },
      { month: "Jun", count: 3034 },
    ],
  };


  const { totalUsers, totalDeposit, totalWithdraw, totalSupport, users } = data;
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
            <Bar
              data={{
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
              }}
              options={{ responsive: true }}
            />
          </CardContent>
        </Card>

        {/* Line Chart - Dots */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Monthly Users Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'Users',
                    data: users.map((u) => u.count),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.3)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Line Chart - Label */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Support Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'Support Requests',
                    data: data.supports.map((s) => s.count),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    tension: 0.4,
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Deposits Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'Deposits',
                    data: data.deposits.map((d) => d.count),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.3)',
                    tension: 0.4,
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
