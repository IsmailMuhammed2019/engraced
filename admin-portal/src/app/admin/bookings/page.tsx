"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ArrowUpDown,
  MoreHorizontal,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  Users,
  Route,
  Calendar as CalendarIcon,
  Edit,
  RefreshCw
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

interface Booking {
  id: string;
  bookingNumber: string;
  route: string;
  passenger: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  amount: string;
  passengers: number;
  seats: string[];
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', reason: '' });

  // Chart data - will be populated from real data
  const [chartData, setChartData] = useState({
    dailyBookingsData: [] as any[],
    routePopularityData: [] as any[],
    bookingStatusData: [] as any[],
    monthlyBookingsData: [] as any[]
  });

  // Fetch bookings data
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    alert(`Viewing booking: ${booking.bookingNumber}`);
  };

  const handleEditBooking = (booking: Booking) => {
    alert(`Editing booking: ${booking.bookingNumber}`);
  };

  const handleDeleteBooking = (booking: Booking) => {
    if (confirm(`Are you sure you want to delete booking ${booking.bookingNumber}?`)) {
      setBookings(prev => prev.filter(b => b.id !== booking.id));
      alert('Booking deleted successfully!');
    }
  };

  const handleConfirmBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  const handleStatusUpdate = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusUpdate({ status: booking.status, reason: '' });
    setShowStatusModal(true);
  };

  const updateBookingStatus = async () => {
    if (!selectedBooking || !statusUpdate.status) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3003/api/v1/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusUpdate.status,
          reason: statusUpdate.reason
        })
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b.id === selectedBooking.id 
            ? { ...b, status: statusUpdate.status as any }
            : b
        ));
        alert('Booking status updated successfully!');
      } else {
        // Mock update for development
        setBookings(prev => prev.map(b => 
          b.id === selectedBooking.id 
            ? { ...b, status: statusUpdate.status as any }
            : b
        ));
        alert('Booking status updated successfully! (Mock)');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
    
    setShowStatusModal(false);
    setStatusUpdate({ status: '', reason: '' });
  };

  const confirmBooking = async () => {
    if (!selectedBooking) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3003/api/v1/bookings/${selectedBooking.id}/confirm`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => 
          b.id === selectedBooking.id 
            ? { ...b, status: 'confirmed' as const }
            : b
        ));
        alert('Booking confirmed successfully!');
      } else {
        // Mock confirmation for development
        setBookings(prev => prev.map(b => 
          b.id === selectedBooking.id 
            ? { ...b, status: 'confirmed' as const }
            : b
        ));
        alert('Booking confirmed successfully! (Mock)');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking');
    } finally {
      setShowConfirmModal(false);
      setSelectedBooking(null);
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "bookingNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Booking ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("bookingNumber")}</div>
      ),
    },
    {
      accessorKey: "passenger",
      header: "Passenger",
      cell: ({ row }) => {
        const passenger = row.getValue("passenger") as Booking["passenger"];
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{passenger.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Mail className="h-3 w-3" />
              <span>{passenger.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Phone className="h-3 w-3" />
              <span>{passenger.phone}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-[#5d4a15]" />
          <span className="font-medium">{row.getValue("route")}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{booking.date}</span>
            </div>
            <div className="text-sm text-gray-500">{booking.time}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => getPaymentStatusBadge(row.getValue("paymentStatus")),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.getValue("amount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "passengers",
      header: "Passengers",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="text-center">
            <span className="font-medium">{booking.passengers}</span>
            <div className="text-xs text-gray-500">Seats: {booking.seats.join(", ")}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(booking.bookingNumber)}
              >
                Copy booking ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewBooking(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditBooking(row.original)}>
                <Calendar className="mr-2 h-4 w-4" />
                Reschedule
              </DropdownMenuItem>
              {row.original.status === 'pending' && (
                <DropdownMenuItem onClick={() => handleConfirmBooking(row.original)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm booking
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleStatusUpdate(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Update status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteBooking(row.original)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600 mt-1">Manage and track all customer bookings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
          </div>
      </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter(booking => booking.status === "confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {bookings.length > 0 ? Math.round((bookings.filter(booking => booking.status === "confirmed").length / bookings.length) * 100) : 0}% of total
              </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter(booking => booking.status === "pending").length}
              </div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#5d4a15]" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
                ₦{bookings
                  .filter(booking => booking.paymentStatus === "paid")
                  .reduce((sum, booking) => sum + parseInt(booking.amount.replace(/[₦,]/g, "")), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">From paid bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Bookings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Bookings Trend
            </CardTitle>
            <CardDescription>Booking volume and confirmation rates over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData.dailyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `₦${Number(value).toLocaleString()}` : value,
                    name === 'bookings' ? 'Total Bookings' : name === 'confirmed' ? 'Confirmed' : name === 'pending' ? 'Pending' : 'Revenue'
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="bookings" fill="#5d4a15" name="Total Bookings" />
                <Bar yAxisId="left" dataKey="confirmed" fill="#10b981" name="Confirmed" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Popular Routes
            </CardTitle>
            <CardDescription>Most booked routes and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.routePopularityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="route" type="category" width={100} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'bookings' ? value : `₦${Number(value).toLocaleString()}`,
                    name === 'bookings' ? 'Bookings' : 'Revenue'
                  ]}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#5d4a15" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {chartData.routePopularityData.map((route, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }}></div>
                    <span>{route.route}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{route.bookings} bookings</div>
                    <div className="text-xs text-gray-500">₦{route.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends and Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Bookings Growth
            </CardTitle>
            <CardDescription>Booking trends and growth rates over 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.monthlyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `₦${Number(value).toLocaleString()}` : value,
                    name === 'bookings' ? 'Total Bookings' : name === 'confirmed' ? 'Confirmed' : name === 'revenue' ? 'Revenue' : 'Growth %'
                  ]}
                />
                <Legend />
                <Area type="monotone" dataKey="bookings" stackId="1" stroke="#5d4a15" fill="#5d4a15" fillOpacity={0.6} />
                <Area type="monotone" dataKey="confirmed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Booking Status
            </CardTitle>
            <CardDescription>Distribution of booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {chartData.bookingStatusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <span>{status.name}</span>
                  </div>
                  <span className="font-medium">{status.count} bookings</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Bookings Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
            <CardDescription>
              A comprehensive list of all customer bookings with detailed information and management options.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4a15]"></div>
                <span className="ml-2">Loading bookings...</span>
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={bookings} 
                searchKey="passenger"
                searchPlaceholder="Search by passenger name..."
              />
          )}
        </CardContent>
      </Card>

      {/* Booking Confirmation Modal */}
      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
            <div className="space-y-3 mb-6">
              <p><strong>Booking Number:</strong> {selectedBooking.bookingNumber}</p>
              <p><strong>Passenger:</strong> {selectedBooking.passenger.name}</p>
              <p><strong>Route:</strong> {selectedBooking.route}</p>
              <p><strong>Date:</strong> {selectedBooking.date}</p>
              <p><strong>Time:</strong> {selectedBooking.time}</p>
              <p><strong>Amount:</strong> {selectedBooking.amount}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                className="bg-[#5d4a15] hover:bg-[#6b5618]"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
            </div>
          )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Booking Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
                <textarea
                  value={statusUpdate.reason}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for status change..."
                  className="w-full p-2 border border-gray-300 rounded-md h-20"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={updateBookingStatus}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}