import { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiBriefcase } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/summary');
      setData(response.data.data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format the month numbers into readable strings for the LineChart
  const formatMonthlyData = (monthlyData) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthlyData?.map((item) => ({
      name: `${monthNames[item.month - 1]} ${item.year}`,
      Employees: item.count,
    })) || [];
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-500">
        <p>Something went wrong loading the dashboard.</p>
        <button onClick={fetchDashboardData} className="mt-4 text-brand-600 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  const stats = data?.statistics;
  const chartDataDepartments = data?.charts?.employeesByDepartment || [];
  const chartDataMonthly = formatMonthlyData(data?.charts?.monthlyJoined);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Statistics Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Employees Card */}
        <div className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <div className="rounded-full bg-brand-100 p-4 text-brand-600">
            <FiUsers size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <p className="text-2xl font-semibold text-gray-800">{stats?.totalEmployees || 0}</p>
          </div>
        </div>

        {/* Active Employees Card */}
        <div className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <div className="rounded-full bg-emerald-100 p-4 text-emerald-600">
            <FiUserCheck size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Employees</p>
            <p className="text-2xl font-semibold text-gray-800">{stats?.activeEmployees || 0}</p>
          </div>
        </div>

        {/* Inactive Employees Card */}
        <div className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <div className="rounded-full bg-red-100 p-4 text-red-600">
            <FiUserX size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Inactive</p>
            <p className="text-2xl font-semibold text-gray-800">{stats?.inactiveEmployees || 0}</p>
          </div>
        </div>

        {/* Total Departments Card */}
        <div className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <div className="rounded-full bg-indigo-100 p-4 text-indigo-600">
            <FiBriefcase size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Departments</p>
            <p className="text-2xl font-semibold text-gray-800">{stats?.totalDepartments || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Bar Chart: Employees by Department */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Employees by Department</h2>
          <div className="h-72 w-full">
            {chartDataDepartments.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataDepartments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="departmentName" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">No department data available</div>
            )}
          </div>
        </div>

        {/* Line Chart: Hiring Trend (Monthly Joined) */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Hiring Trend</h2>
          <div className="h-72 w-full">
            {chartDataMonthly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDataMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="Employees" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">No hiring data available</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;