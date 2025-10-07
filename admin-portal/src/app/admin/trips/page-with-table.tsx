"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal, AlertModal } from "@/components/ui/modal";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  User,
  Car,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Trip {
  id: string;
  route: {
    from: string;
    to: string;
  };
  driver?: {
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  vehicle?: {
    plateNumber: string;
    make: string;
    model: string;
  } | null;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
  availableSeats: number;
  totalSeats: number;
  bookingsCount: number;
  features: string[];
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [alertModal, setAlertModal] = useState<{show: boolean; title: string; message: string; type: 'success' | 'error' | 'info'}>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  const [newTrip, setNewTrip] = useState({
    routeId: '',
    driverId: '',
    vehicleId: '',
    departureTime: '',
    arrivalTime: '',
    price: ''
  });

  // Fetch trips data
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/trips', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleTrip = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/trips', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTrip)
      });
      
      if (response.ok) {
        const addedTrip = await response.json();
        setTrips(prev => [...prev, addedTrip]);
        setShowCreateForm(false);
        setNewTrip({
          routeId: '',
          driverId: '',
          vehicleId: '',
          departureTime: '',
          arrivalTime: '',
          price: ''
        });
        showAlert('Success', 'Trip created successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', `Failed to create trip: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error scheduling trip:', error);
      showAlert('Error', 'Failed to schedule trip', 'error');
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:3003/api/v1/trips/${tripId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setTrips(prev => prev.filter(t => t.id !== tripId));
          showAlert('Success', 'Trip deleted successfully!', 'success');
        } else {
          showAlert('Error', 'Failed to delete trip', 'error');
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
        showAlert('Error', 'Failed to delete trip', 'error');
      }
    }
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setAlertModal({ show: true, title, message, type });
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.driver && `${trip.driver.firstName} ${trip.driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trip.vehicle && trip.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case "INACTIVE":
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate stats for cards
  const stats = {
    total: trips.length,
    active: trips.filter(t => t.status === 'ACTIVE').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
    totalRevenue: trips.reduce((sum, t) => sum + (t.price * t.bookingsCount), 0),
    totalBookings: trips.reduce((sum, t) => sum + t.bookingsCount, 0),
    avgOccupancy: trips.length > 0 
      ? trips.reduce((sum, t) => sum + ((t.totalSeats - t.availableSeats) / t.totalSeats * 100), 0) / trips.length
      : 0
  };

  // Chart data - Trips by Route
  const routeData = trips.reduce((acc: any[], trip) => {
    const routeName = `${trip.route.from} → ${trip.route.to}`;
    const existing = acc.find(item => item.route === routeName);
    if (existing) {
      existing.count += 1;
      existing.bookings += trip.bookingsCount;
    } else {
      acc.push({ route: routeName, count: 1, bookings: trip.bookingsCount });
    }
    return acc;
  }, []).slice(0, 5); // Top 5 routes

  // Chart data - Trips by Status
  const statusData = [
    { name: 'Active', value: stats.active, color: '#22c55e' },
    { name: 'Completed', value: stats.completed, color: '#3b82f6' },
    { name: 'Cancelled', value: trips.filter(t => t.status === 'CANCELLED').length, color: '#ef4444' },
    { name: 'Inactive', value: trips.filter(t => t.status === 'INACTIVE').length, color: '#6b7280' },
  ].filter(item => item.value > 0);

  // Chart data - Daily trips (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyTripsData = last7Days.map(date => {
    const dayTrips = trips.filter(t => t.departureTime.startsWith(date));
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      trips: dayTrips.length,
      bookings: dayTrips.reduce((sum, t) => sum + t.bookingsCount, 0)
    };
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trips Management</h1>
            <p className="text-gray-600 mt-1">Schedule and manage all trips</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-[#5d4a15] hover:bg-[#6b5618]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Trip
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalBookings}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-[#5d4a15]">₦{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Occupancy</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.avgOccupancy.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Trips Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Trips & Bookings (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyTripsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="trips" fill="#5d4a15" name="Trips" />
                  <Bar dataKey="bookings" fill="#f59e0b" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Trip Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Routes Chart */}
        {routeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Routes by Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={routeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="route" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#5d4a15" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Trips Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Trips</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search trips..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading trips...</div>
            ) : filteredTrips.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No trips found. Schedule your first trip to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Departure</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Seats</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Bookings</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTrips.map((trip) => {
                      const departure = formatDateTime(trip.departureTime);
                      const occupancyRate = ((trip.totalSeats - trip.availableSeats) / trip.totalSeats * 100).toFixed(0);
                      
                      return (
                        <tr key={trip.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{trip.route.from}</p>
                                <p className="text-sm text-gray-500">→ {trip.route.to}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {trip.driver ? (
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {trip.driver.firstName} {trip.driver.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{trip.driver.phone}</p>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not assigned</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {trip.vehicle ? (
                              <div>
                                <p className="text-sm font-medium text-gray-900">{trip.vehicle.plateNumber}</p>
                                <p className="text-xs text-gray-500">{trip.vehicle.make} {trip.vehicle.model}</p>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not assigned</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{departure.date}</p>
                              <p className="text-xs text-gray-500">{departure.time}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(trip.status)}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {trip.availableSeats}/{trip.totalSeats}
                              </p>
                              <p className="text-xs text-gray-500">{occupancyRate}% occupied</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-900">₦{trip.price.toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-900">{trip.bookingsCount}</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const driverName = trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : 'Not assigned';
                                  const vehiclePlate = trip.vehicle ? trip.vehicle.plateNumber : 'Not assigned';
                                  showAlert(
                                    'Trip Details',
                                    `Route: ${trip.route.from} → ${trip.route.to}\nDriver: ${driverName}\nVehicle: ${vehiclePlate}\nPrice: ₦${trip.price}\nBookings: ${trip.bookingsCount}`,
                                    'info'
                                  );
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTrip(trip.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Trip Modal */}
        <Modal
          isOpen={showCreateForm}
          onClose={() => {
            setShowCreateForm(false);
            setNewTrip({
              routeId: '',
              driverId: '',
              vehicleId: '',
              departureTime: '',
              arrivalTime: '',
              price: ''
            });
          }}
          title="Schedule New Trip"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routeId">Route ID *</Label>
                <Input
                  id="routeId"
                  value={newTrip.routeId}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, routeId: e.target.value }))}
                  placeholder="Enter route ID"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTrip.price}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 5000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driverId">Driver ID *</Label>
                <Input
                  id="driverId"
                  value={newTrip.driverId}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, driverId: e.target.value }))}
                  placeholder="Enter driver ID"
                />
              </div>
              <div>
                <Label htmlFor="vehicleId">Vehicle ID *</Label>
                <Input
                  id="vehicleId"
                  value={newTrip.vehicleId}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, vehicleId: e.target.value }))}
                  placeholder="Enter vehicle ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departureTime">Departure Time *</Label>
                <Input
                  id="departureTime"
                  type="datetime-local"
                  value={newTrip.departureTime}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, departureTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="arrivalTime">Arrival Time *</Label>
                <Input
                  id="arrivalTime"
                  type="datetime-local"
                  value={newTrip.arrivalTime}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, arrivalTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTrip({
                    routeId: '',
                    driverId: '',
                    vehicleId: '',
                    departureTime: '',
                    arrivalTime: '',
                    price: ''
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleTrip}
                className="bg-[#5d4a15] hover:bg-[#6b5618]"
              >
                Schedule Trip
              </Button>
            </div>
          </div>
        </Modal>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.show}
          onClose={() => setAlertModal({...alertModal, show: false})}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </AdminLayout>
  );
}

