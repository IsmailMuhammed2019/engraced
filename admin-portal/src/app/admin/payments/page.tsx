"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  CreditCard,
  TrendingUp,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Users,
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
  PieChart as RechartsPieChart, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from "recharts";

interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  reference: string;
  createdAt: string;
  booking: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    route: {
      from: string;
      to: string;
    };
  };
}

interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalRevenue: number;
  averageTransactionValue: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalRevenue: 0,
    averageTransactionValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Chart data
  const dailyRevenueData = [
    { date: '2024-01-01', revenue: 45000, transactions: 12, successRate: 95 },
    { date: '2024-01-02', revenue: 52000, transactions: 15, successRate: 93 },
    { date: '2024-01-03', revenue: 38000, transactions: 10, successRate: 90 },
    { date: '2024-01-04', revenue: 61000, transactions: 18, successRate: 97 },
    { date: '2024-01-05', revenue: 48000, transactions: 14, successRate: 92 },
    { date: '2024-01-06', revenue: 55000, transactions: 16, successRate: 94 },
    { date: '2024-01-07', revenue: 42000, transactions: 13, successRate: 91 }
  ];

  const paymentMethodData = [
    { name: 'Paystack', value: 65, count: 156, color: '#5d4a15' },
    { name: 'Bank Transfer', value: 20, count: 48, color: '#3b82f6' },
    { name: 'Card Payment', value: 10, count: 24, color: '#10b981' },
    { name: 'Mobile Money', value: 5, count: 12, color: '#f59e0b' }
  ];

  const monthlyTrendData = [
    { month: 'Jan', revenue: 120000, transactions: 45, growth: 15 },
    { month: 'Feb', revenue: 135000, transactions: 52, growth: 12 },
    { month: 'Mar', revenue: 148000, transactions: 58, growth: 9 },
    { month: 'Apr', revenue: 162000, transactions: 65, growth: 8 },
    { month: 'May', revenue: 175000, transactions: 72, growth: 7 },
    { month: 'Jun', revenue: 189000, transactions: 78, growth: 6 }
  ];

  const statusDistributionData = [
    { name: 'Completed', value: 85, count: 204, color: '#10b981' },
    { name: 'Pending', value: 10, count: 24, color: '#f59e0b' },
    { name: 'Failed', value: 5, count: 12, color: '#ef4444' }
  ];
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch payments data
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/payments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        console.error('Failed to fetch payments');
        // Fallback to mock data for development
        setPayments(getMockPayments());
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Fallback to mock data for development
      setPayments(getMockPayments());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/payments/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats');
        // Fallback to calculated stats from mock data
        const mockPayments = getMockPayments();
        setStats(calculateStats(mockPayments));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to calculated stats from mock data
      const mockPayments = getMockPayments();
      setStats(calculateStats(mockPayments));
    }
  };

  // Mock data for development
  const getMockPayments = (): Payment[] => [
    {
      id: "PAY-001234",
      amount: 7500,
      status: "completed",
      method: "Card",
      reference: "TXN_001234567",
      createdAt: "2024-01-15T06:00:00Z",
      booking: {
        id: "BK-001234",
        user: { firstName: "John", lastName: "Doe", email: "john@example.com" },
        route: { from: "Lagos", to: "Abuja" }
      }
    },
    {
      id: "PAY-001235",
      amount: 3200,
      status: "pending",
      method: "Bank Transfer",
      reference: "TXN_001234568",
      createdAt: "2024-01-15T14:30:00Z",
      booking: {
        id: "BK-001235",
        user: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
        route: { from: "Abuja", to: "Lagos" }
      }
    },
    {
      id: "PAY-001236",
      amount: 6200,
      status: "completed",
      method: "Card",
      reference: "TXN_001234569",
      createdAt: "2024-01-16T08:00:00Z",
      booking: {
        id: "BK-001236",
        user: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com" },
        route: { from: "Lagos", to: "Kano" }
      }
    },
    {
      id: "PAY-001237",
      amount: 8500,
      status: "failed",
      method: "Card",
      reference: "TXN_001234570",
      createdAt: "2024-01-16T12:00:00Z",
      booking: {
        id: "BK-001237",
        user: { firstName: "Sarah", lastName: "Wilson", email: "sarah@example.com" },
        route: { from: "Kano", to: "Lagos" }
      }
    }
  ];

  const calculateStats = (payments: Payment[]): PaymentStats => {
    const totalPayments = payments.length;
    const successfulPayments = payments.filter(p => p.status === "completed").length;
    const failedPayments = payments.filter(p => p.status === "failed").length;
    const totalRevenue = payments
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const averageTransactionValue = totalRevenue / successfulPayments || 0;

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenue,
      averageTransactionValue
    };
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter payments based on search and status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === "" || 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive payment insights and transaction management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchPayments} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="btn-golden">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPayments}</div>
              <p className="text-xs text-gray-500">All transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Successful</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.successfulPayments}</div>
              <p className="text-xs text-gray-500">
                {stats.totalPayments > 0 ? Math.round((stats.successfulPayments / stats.totalPayments) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.failedPayments}</div>
              <p className="text-xs text-gray-500">
                {stats.totalPayments > 0 ? Math.round((stats.failedPayments / stats.totalPayments) * 100) : 0}% failure rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-[#5d4a15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-gray-500">From successful payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Transaction</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.averageTransactionValue)}
              </div>
              <p className="text-xs text-gray-500">Per successful payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Revenue Trend
              </CardTitle>
              <CardDescription>Revenue and transaction volume over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : name === 'transactions' ? 'Transactions' : 'Success Rate'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#5d4a15" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} name="Transactions" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Distribution of payment methods used</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {paymentMethodData.map((method, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                      <span>{method.name}</span>
                    </div>
                    <span className="font-medium">{method.count} transactions</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends and Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Revenue Growth
              </CardTitle>
              <CardDescription>Revenue trends and growth rates over 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : name === 'transactions' ? 'Transactions' : 'Growth %'
                    ]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#5d4a15" fill="#5d4a15" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Payment Status
              </CardTitle>
              <CardDescription>Distribution of payment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusDistributionData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                      <span>{status.name}</span>
                    </div>
                    <span className="font-medium">{status.count} payments</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Payment Transactions</CardTitle>
                <CardDescription>View and manage all payment transactions</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search payments..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading payments...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{payment.id}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Customer:</span> {payment.booking.user.firstName} {payment.booking.user.lastName}
                        </div>
                        <div>
                          <span className="font-medium">Booking:</span> {payment.booking.id}
                        </div>
                        <div>
                          <span className="font-medium">Method:</span> {payment.method}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {formatDate(payment.createdAt)}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Reference:</span> {payment.reference}
                        <span className="ml-4 font-medium">Route:</span> {payment.booking.route.from} → {payment.booking.route.to}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredPayments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No payments found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Generate and download payment reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export All Payments (CSV)
              </Button>
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Export by Date Range
              </Button>
              <Button variant="outline" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Export Successful Payments Only
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-bold">{formatCurrency(stats.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-bold">
                  {stats.totalPayments > 0 ? Math.round((stats.successfulPayments / stats.totalPayments) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Transaction:</span>
                <span className="font-bold">{formatCurrency(stats.averageTransactionValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Transactions:</span>
                <span className="font-bold">{stats.totalPayments}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}