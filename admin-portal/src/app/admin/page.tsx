"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  RefreshCw
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
  Cell,
  Legend
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalRoutes: number;
  totalBookings: number;
  totalRevenue: number;
  totalDrivers: number;
  totalVehicles: number;
  totalTrips: number;
  activeTrips: number;
  todayBookings: number;
  monthlyRevenue: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRoutes: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalDrivers: 0,
    totalVehicles: 0,
    totalTrips: 0,
    activeTrips: 0,
    todayBookings: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [routePerformance, setRoutePerformance] = useState<any[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Fetch all data in parallel
      const [
        systemStats,
        bookings,
        routes,
        trips,
        drivers,
        vehicles,
        payments
      ] = await Promise.all([
        fetch('http://localhost:3003/api/v1/system/stats', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).then(r => r.ok ? r.json() : { totalUsers: 0, totalRoutes: 0, totalBookings: 0, totalRevenue: 0 }),
        
        fetch('http://localhost:3003/api/v1/bookings', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).then(r => r.ok ? r.json() : []),
        
        fetch('http://localhost:3003/api/v1/routes', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).then(r => r.ok ? r.json() : []),
        
        fetch('http://localhost:3003/api/v1/trips', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).then(r => r.ok ? r.json() : []),
        
        fetch('http://localhost:3003/api/v1/drivers', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).then(r => r.ok ? r.json() : []),
        
        fetch('http://localhost:3003/api/v1/vehicles', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).then(r => r.ok ? r.json() : []),
        
        fetch('http://localhost:3003/api/v1/payments', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).then(r => r.ok ? r.json() : [])
      ]);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookings.filter((b: any) => b.createdAt?.startsWith(today)).length;
      
      const currentMonth = new Date().getMonth();
      const monthlyRevenue = payments
        .filter((p: any) => {
          const paymentDate = new Date(p.createdAt);
          return paymentDate.getMonth() === currentMonth && p.paymentStatus === 'PAID';
        })
        .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

      setStats({
        totalUsers: (systemStats as any).totalUsers || 0,
        totalRoutes: routes.filter((r: any) => r.isActive).length,
        totalBookings: bookings.length,
        totalRevenue: parseFloat((systemStats as any).totalRevenue) || 0,
        totalDrivers: drivers.filter((d: any) => d.isActive).length,
        totalVehicles: vehicles.filter((v: any) => v.isActive).length,
        totalTrips: trips.length,
        activeTrips: trips.filter((t: any) => t.status === 'ACTIVE').length,
        todayBookings,
        monthlyRevenue
      });

      // Generate revenue chart data (last 6 months)
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          monthIndex: date.getMonth(),
          year: date.getFullYear()
        };
      });

      const revenueChartData = last6Months.map(({ month, monthIndex, year }) => {
        const monthPayments = payments.filter((p: any) => {
          const paymentDate = new Date(p.createdAt);
          return paymentDate.getMonth() === monthIndex && 
                 paymentDate.getFullYear() === year &&
                 p.paymentStatus === 'PAID';
        });
        
        const revenue = monthPayments.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
        const bookingCount = monthPayments.length;
        
        return { month, revenue, bookings: bookingCount };
      });
      setRevenueData(revenueChartData);

      // Route performance data (top 5 routes by bookings)
      const routeStats = routes.map((route: any) => {
        const routeBookings = bookings.filter((b: any) => b.routeId === route.id);
        const routeRevenue = routeBookings.reduce((sum: number, b: any) => 
          sum + (parseFloat(b.totalAmount) || 0), 0
        );
        
        return {
          name: `${route.from} → ${route.to}`,
          bookings: routeBookings.length,
          revenue: routeRevenue
        };
      })
      .sort((a: any, b: any) => b.bookings - a.bookings)
      .slice(0, 5);
      setRoutePerformance(routeStats);

      // Booking status distribution
      const statusCounts = {
        CONFIRMED: bookings.filter((b: any) => b.status === 'CONFIRMED').length,
        PENDING: bookings.filter((b: any) => b.status === 'PENDING').length,
        CANCELLED: bookings.filter((b: any) => b.status === 'CANCELLED').length,
        COMPLETED: bookings.filter((b: any) => b.status === 'COMPLETED').length,
      };

      const statusChartData = [
        { name: 'Confirmed', value: statusCounts.CONFIRMED, color: '#10b981' },
        { name: 'Pending', value: statusCounts.PENDING, color: '#f59e0b' },
        { name: 'Cancelled', value: statusCounts.CANCELLED, color: '#ef4444' },
        { name: 'Completed', value: statusCounts.COMPLETED, color: '#3b82f6' },
      ].filter(item => item.value > 0);
      setBookingStatusData(statusChartData);

      // Recent bookings
      const recent = bookings
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentBookings(recent);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "",
      changeType: "increase",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Routes",
      value: stats.totalRoutes.toString(),
      change: "",
      changeType: "increase",
      icon: Route,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Bookings Today",
      value: stats.todayBookings.toString(),
      change: "",
      changeType: "increase",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Revenue (₦)",
      value: stats.totalRevenue.toLocaleString(),
      change: "",
      changeType: "increase",
      icon: DollarSign,
      color: "text-[#5d4a15]",
      bgColor: "bg-[#fdf6e3]"
    },
    {
      title: "Active Trips",
      value: stats.activeTrips.toString(),
      change: "",
      changeType: "increase",
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Total Drivers",
      value: stats.totalDrivers.toString(),
      change: "",
      changeType: "increase",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Total Vehicles",
      value: stats.totalVehicles.toString(),
      change: "",
      changeType: "increase",
      icon: Car,
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    },
    {
      title: "Monthly Revenue",
      value: `₦${stats.monthlyRevenue.toLocaleString()}`,
      change: "",
      changeType: "increase",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="h-8 w-8 animate-spin text-[#5d4a15]" />
          <span className="ml-2 text-lg">Loading dashboard...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-xs flex items-center ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change} from last month
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue and bookings (Last 6 months)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'revenue') return [`₦${value.toLocaleString()}`, 'Revenue'];
                      return [value, 'Bookings'];
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#5d4a15" 
                    fill="#5d4a15" 
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.6}
                    name="Bookings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Booking Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Current status of all bookings</CardDescription>
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
                    outerRadius={100}
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
        </div>

        {/* Route Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Routes Performance</CardTitle>
            <CardDescription>Most popular routes by bookings and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'Revenue') return [`₦${value.toLocaleString()}`, name];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="bookings" fill="#5d4a15" name="Bookings" />
                <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b" name="Revenue (₦)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No recent bookings</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">{booking.bookingNumber}</p>
                        <Badge className={
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {booking.route?.from} → {booking.route?.to}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₦{parseFloat(booking.totalAmount).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{booking.passengerCount} passenger(s)</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Drivers</span>
                  <span className="font-medium">{stats.totalDrivers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Vehicles</span>
                  <span className="font-medium">{stats.totalVehicles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Trips</span>
                  <span className="font-medium">{stats.activeTrips}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bookings</span>
                  <span className="font-medium">{stats.todayBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Routes</span>
                  <span className="font-medium">{stats.totalRoutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Trips</span>
                  <span className="font-medium">{stats.totalTrips}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="font-medium">₦{stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">₦{stats.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg/Booking</span>
                  <span className="font-medium">
                    ₦{stats.totalBookings > 0 
                      ? (stats.totalRevenue / stats.totalBookings).toLocaleString(undefined, {maximumFractionDigits: 0})
                      : 0
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

