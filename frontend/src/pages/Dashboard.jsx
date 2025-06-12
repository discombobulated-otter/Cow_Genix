// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, 
    PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis,
    ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { 
    Users, Activity, TrendingUp, AlertTriangle, DollarSign, Calendar, 
    Clock, Filter, Download, RefreshCw, Maximize2, Minimize2, Info,
    Building2, Store, Heart, LineChart as LineChartIcon,
    Syringe, Milk, Baby, Thermometer, Stethoscope, PiggyBank
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const mockData = {
    totalCows: 150,
    activeCows: 120,
    totalVets: 25,
    totalShops: 15,
    healthMetrics: [
        { name: 'Healthy', value: 80 },
        { name: 'Under Treatment', value: 15 },
        { name: 'Critical', value: 5 }
    ],
    financialMetrics: {
        monthlyRevenue: 25000,
        monthlyExpenses: 15000,
        profitMargin: 40,
        monthlyData: [
            { month: 'Jan', revenue: 20000, expenses: 12000 },
            { month: 'Feb', revenue: 22000, expenses: 13000 },
            { month: 'Mar', revenue: 25000, expenses: 15000 }
        ]
    },
    breedingStats: {
        successfulBreedings: 15,
        upcomingBreedings: 3,
        breedingSuccessRate: 85,
        monthlyBreedings: [
            { month: 'Jan', total: 5, successful: 4 },
            { month: 'Feb', total: 7, successful: 6 },
            { month: 'Mar', total: 6, successful: 5 }
        ]
    },
    cowDistribution: [
        { name: 'Milking', value: 60 },
        { name: 'Pregnant', value: 25 },
        { name: 'Calves', value: 15 }
    ],
    milkProduction: [
        { date: '2024-01', quantity: 1200 },
        { date: '2024-02', quantity: 1300 },
        { date: '2024-03', quantity: 1400 }
    ],
    vaccinationStatus: {
        due: 5,
        completed: 120,
        upcoming: 3
    },
    ageDistribution: [
        { age: '0-1', count: 20 },
        { age: '1-2', count: 35 },
        { age: '2-3', count: 45 },
        { age: '3+', count: 50 }
    ],
    recentActivities: [
        {
            title: 'New Cow Added',
            description: 'Added new cow ID: C001',
            time: '2 hours ago'
        },
        {
            title: 'Health Check',
            description: 'Regular health check completed for 10 cows',
            time: '4 hours ago'
        },
        {
            title: 'Milk Production',
            description: 'Daily milk production recorded',
            time: '6 hours ago'
        }
    ],
    healthAlerts: [
        {
            title: 'Vaccination Due',
            description: '5 cows need vaccination',
            time: '1 hour ago'
        },
        {
            title: 'Health Check Required',
            description: '3 cows showing signs of illness',
            time: '3 hours ago'
        }
    ]
};

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(mockData);
    const [selectedTimeRange, setSelectedTimeRange] = useState('month');
    const [expandedCharts, setExpandedCharts] = useState({});
    const [chartTheme, setChartTheme] = useState('light');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    const RADIAN = Math.PI / 180;

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`, {
                params: { timeRange: selectedTimeRange },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Use mock data in development
            if (import.meta.env.DEV) {
                console.log('Using mock data in development');
                setStats({
                    ...mockData,
                    breedingStats: mockData.breedingStats // Map the mock data structure to match backend
                });
            } else {
                setError('Failed to load dashboard data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [selectedTimeRange]);

    const toggleChartExpansion = (chartId) => {
        setExpandedCharts(prev => ({
            ...prev,
            [chartId]: !prev[chartId]
        }));
    };

    const handleTimeRangeChange = (range) => {
        setSelectedTimeRange(range);
    };

    const handleExportData = (chartId) => {
        // Implementation for exporting chart data
        console.log(`Exporting data for chart: ${chartId}`);
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-2xl font-semibold mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const ChartCard = ({ title, children, expanded, onToggle }) => (
        <div className={`bg-white rounded-lg shadow p-6 ${expanded ? 'col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                    onClick={onToggle}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    {expanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
            </div>
            <div className={`${expanded ? 'h-[400px]' : 'h-[300px]'}`}>
                {children}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <AlertTriangle size={48} className="mx-auto mb-4" />
                    <p>{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex space-x-4">
                    <select 
                        value={selectedTimeRange}
                        onChange={(e) => handleTimeRangeChange(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                    </select>
                    <button 
                        onClick={() => fetchDashboardData()}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Cows"
                    value={stats?.totalCows || 0}
                    icon={PiggyBank}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Cows"
                    value={stats?.activeCows || 0}
                    icon={Heart}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Vets"
                    value={stats?.totalVets || 0}
                    icon={Stethoscope}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Total Shops"
                    value={stats?.totalShops || 0}
                    icon={Store}
                    color="bg-orange-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Milk Production Chart */}
                <ChartCard
                    title="Milk Production"
                    expanded={expandedCharts.milkProduction}
                    onToggle={() => toggleChartExpansion('milkProduction')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats?.milkProduction || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Health Metrics Chart */}
                <ChartCard
                    title="Health Metrics"
                    expanded={expandedCharts.healthMetrics}
                    onToggle={() => toggleChartExpansion('healthMetrics')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.healthMetrics || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Cow Distribution Chart */}
                <ChartCard
                    title="Cow Distribution"
                    expanded={expandedCharts.cowDistribution}
                    onToggle={() => toggleChartExpansion('cowDistribution')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats?.cowDistribution || []}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {(stats?.cowDistribution || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Financial Metrics Chart */}
                <ChartCard
                    title="Financial Overview"
                    expanded={expandedCharts.financialMetrics}
                    onToggle={() => toggleChartExpansion('financialMetrics')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.financialMetrics?.monthlyData || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" fill="#8884d8" />
                            <Area type="monotone" dataKey="expenses" fill="#82ca9d" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Breeding Metrics */}
                <ChartCard
                    title="Breeding Metrics"
                    expanded={expandedCharts.breedingStats}
                    onToggle={() => toggleChartExpansion('breedingStats')}
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="text-sm font-medium text-gray-500">Success Rate</h4>
                                <p className="text-2xl font-semibold">{stats?.breedingStats?.breedingSuccessRate || 0}%</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="text-sm font-medium text-gray-500">Upcoming Breedings</h4>
                                <p className="text-2xl font-semibold">{stats?.breedingStats?.upcomingBreedings || 0}</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats?.breedingStats?.monthlyBreedings || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="successful" fill="#8884d8" name="Successful" />
                                <Bar dataKey="total" fill="#82ca9d" name="Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Recent Activities and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                        {(stats?.recentActivities || []).map((activity, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Activity className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium">{activity.title}</p>
                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health Alerts */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Health Alerts</h3>
                    <div className="space-y-4">
                        {(stats?.healthAlerts || []).map((alert, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="font-medium">{alert.title}</p>
                                    <p className="text-sm text-gray-500">{alert.description}</p>
                                    <p className="text-xs text-gray-400">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Breeding Statistics */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Breeding Statistics</h3>
                    <div className="flex space-x-2">
                        <button onClick={() => handleExportData('breeding')} className="p-2 hover:bg-gray-100 rounded-full">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-gray-500">Successful Breedings</p>
                        <h4 className="text-2xl font-bold">{stats.breedingStats?.successfulBreedings || 0}</h4>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500">Upcoming Breedings</p>
                        <h4 className="text-2xl font-bold">{stats.breedingStats?.upcomingBreedings || 0}</h4>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500">Success Rate</p>
                        <h4 className="text-2xl font-bold">{stats.breedingStats?.breedingSuccessRate || 0}%</h4>
                    </div>
                </div>
                <div className="mt-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.breedingStats.monthlyBreedings}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="successful" stroke="#10B981" />
                            <Line type="monotone" dataKey="total" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
