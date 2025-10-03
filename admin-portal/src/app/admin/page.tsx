"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Route, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Car,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 1200000, bookings: 45 },
    { month: 'Feb', revenue: 1900000, bookings: 67 },
    { month: 'Mar', revenue: 3000000, bookings: 89 },
    { month: 'Apr', revenue: 2800000, bookings: 76 },
    { month: 'May', revenue: 1890000, bookings: 54 },
    { month: 'Jun', revenue: 2390000, bookings: 82 },
  ];

  const routePerformance = [
    { name: 'Lagos-Abuja', bookings: 45, revenue: 1800000 },
    { name: 'Abuja-Kaduna', bookings: 32, revenue: 960000 },
    { name: 'Lagos-Port Harcourt', bookings: 28, revenue: 840000 },
    { name: 'Enugu-Lagos', bookings: 22, revenue: 880000 },
    { name: 'Kano-Abuja', bookings: 18, revenue: 720000 },
  ];

  const bookingStatusData = [
    { name: 'Confirmed', value: 65, color: '#10b981' },
    { name: 'Pending', value: 20, color: '#f59e0b' },
    { name: 'Cancelled', value: 15, color: '#ef4444' },
  ];

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Routes",
      value: "24",
      change: "+2",
      changeType: "increase",
      icon: Route,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Bookings Today",
      value: "89",
      change: "+15%",
      changeType: "increase",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Revenue (₦)",
      value: "2,450,000",
      change: "+8%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-[#5d4a15]",
      bgColor: "bg-[#fdf6e3]"
    },
    {
      title: "Active Vehicles",
      value: "12",
      change: "100%",
      changeType: "increase",
      icon: Car,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Upcoming Trips",
      value: "45",
      change: "-3",
      changeType: "decrease",
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ];

  const recentBookings = [
    {
      id: "BK-001234",
      route: "Lagos → Abuja",
      passenger: "John Doe",
      date: "2024-01-15",
      time: "06:00",
      status: "confirmed",
      amount: "₦7,500"
    },
    {
      id: "BK-001235",
      route: "Abuja → Kaduna",
      passenger: "Jane Smith",
      date: "2024-01-15",
      time: "14:30",
      status: "pending",
      amount: "₦3,200"
    },
    {
      id: "BK-001236",
      route: "Lagos → Port Harcourt",
      passenger: "Mike Johnson",
      date: "2024-01-16",
      time: "08:00",
      status: "confirmed",
      amount: "₦6,200"
    },
    {
      id: "BK-001237",
      route: "Enugu → Lagos",
      passenger: "Sarah Wilson",
      date: "2024-01-16",
      time: "12:00",
      status: "cancelled",
      amount: "₦8,500"
    }
  ];

  const recentActivities = [
    {
      type: "booking",
      message: "New booking created",
      details: "Lagos → Abuja - 2 passengers",
      time: "2 minutes ago",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      type: "route",
      message: "Route updated",
      details: "Abuja → Kaduna pricing adjusted",
      time: "15 minutes ago",
      icon: TrendingUp,
      color: "text-blue-500"
    },
    {
      type: "user",
      message: "New user registered",
      details: "john@example.com",
      time: "1 hour ago",
      icon: Users,
      color: "text-purple-500"
    },
    {
      type: "vehicle",
      message: "Vehicle maintenance due",
      details: "LAG123ABC - Next service in 500km",
      time: "2 hours ago",
      icon: AlertCircle,
      color: "text-yellow-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.changeType === "increase" ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <ChangeIcon className={`h-3 w-3 mr-1 ${
                    stat.changeType === "increase" ? "text-green-500" : "text-red-500"
                  }`} />
                  <span className={stat.changeType === "increase" ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }),
                    'Revenue'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#5d4a15" 
                  fill="#fdf6e3" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Routes Performance</CardTitle>
            <CardDescription>Bookings by route</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#5d4a15" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <CardDescription>Current booking status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Bookings</CardTitle>
            <CardDescription>Correlation between revenue and booking volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' 
                      ? value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })
                      : value,
                    name === 'revenue' ? 'Revenue' : 'Bookings'
                  ]}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#5d4a15" 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#6b5618" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking activities</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{booking.id}</p>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-gray-600">{booking.route}</p>
                    <p className="text-xs text-gray-500">
                      {booking.passenger} • {booking.date} at {booking.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.details}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 btn-golden">
              <Route className="h-6 w-6" />
              <span>Manage Routes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Create Trip</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Add Driver</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Car className="h-6 w-6" />
              <span>Add Vehicle</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}