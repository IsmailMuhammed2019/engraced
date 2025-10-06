"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Truck, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Shield,
  Wifi,
  Battery
} from "lucide-react";

interface VehicleAvailability {
  id: string;
  make: string;
  model: string;
  plateNumber: string;
  capacity: number;
  availableSeats: number;
  occupiedSeats: number;
  maintenanceStatus: "active" | "maintenance" | "out_of_service";
  currentLocation: string;
  nextTrip?: {
    id: string;
    route: string;
    departureTime: string;
    passengers: number;
  };
  utilizationRate: number;
  lastUpdated: string;
  features: string[];
  driver?: {
    name: string;
    phone: string;
    status: "available" | "on_trip" | "off_duty";
  };
}

interface SeatOccupancy {
  vehicleId: string;
  tripId: string;
  route: string;
  date: string;
  seats: Array<{
    seatNumber: string;
    isOccupied: boolean;
    passengerName?: string;
    bookingId?: string;
  }>;
}

export default function VehicleAvailabilityPage() {
  const [vehicles, setVehicles] = useState<VehicleAvailability[]>([]);
  const [seatOccupancy, setSeatOccupancy] = useState<SeatOccupancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleAvailability | null>(null);
  const [showSeatMap, setShowSeatMap] = useState(false);

  useEffect(() => {
    fetchVehicleAvailability();
    fetchSeatOccupancy();
  }, []);

  const fetchVehicleAvailability = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/vehicles/availability', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      } else {
        // Fallback to mock data
        setVehicles(getMockVehicleAvailability());
      }
    } catch (error) {
      console.error('Error fetching vehicle availability:', error);
      setVehicles(getMockVehicleAvailability());
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatOccupancy = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/vehicles/seat-occupancy', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSeatOccupancy(data);
      } else {
        // Fallback to mock data
        setSeatOccupancy(getMockSeatOccupancy());
      }
    } catch (error) {
      console.error('Error fetching seat occupancy:', error);
      setSeatOccupancy(getMockSeatOccupancy());
    }
  };

  const getMockVehicleAvailability = (): VehicleAvailability[] => [
    {
      id: "1",
      make: "Toyota",
      model: "Sienna",
      plateNumber: "ABC123XY",
      capacity: 30,
      availableSeats: 12,
      occupiedSeats: 18,
      maintenanceStatus: "active",
      currentLocation: "Lagos Terminal",
      nextTrip: {
        id: "TRIP001",
        route: "Lagos to Abuja",
        departureTime: "14:00",
        passengers: 8
      },
      utilizationRate: 60,
      lastUpdated: "2024-01-15T10:30:00Z",
      features: ["AC", "WiFi", "USB Charging", "Reclining Seats"],
      driver: {
        name: "John Doe",
        phone: "+2348071116229",
        status: "available"
      }
    },
    {
      id: "2",
      make: "Toyota",
      model: "Sienna",
      plateNumber: "XYZ789AB",
      capacity: 30,
      availableSeats: 0,
      occupiedSeats: 30,
      maintenanceStatus: "active",
      currentLocation: "En Route to Abuja",
      utilizationRate: 100,
      lastUpdated: "2024-01-15T11:00:00Z",
      features: ["AC", "WiFi", "USB Charging"],
      driver: {
        name: "Jane Smith",
        phone: "+2348071116230",
        status: "on_trip"
      }
    },
    {
      id: "3",
      make: "Ford",
      model: "Transit",
      plateNumber: "DEF456CD",
      capacity: 25,
      availableSeats: 25,
      occupiedSeats: 0,
      maintenanceStatus: "maintenance",
      currentLocation: "Service Center",
      utilizationRate: 0,
      lastUpdated: "2024-01-15T09:00:00Z",
      features: ["AC", "WiFi", "Entertainment System"],
      driver: {
        name: "Mike Johnson",
        phone: "+2348071116231",
        status: "off_duty"
      }
    }
  ];

  const getMockSeatOccupancy = (): SeatOccupancy[] => [
    {
      vehicleId: "1",
      tripId: "TRIP001",
      route: "Lagos to Abuja",
      date: "2024-01-15",
      seats: Array.from({ length: 30 }, (_, i) => ({
        seatNumber: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
        isOccupied: Math.random() > 0.4,
        passengerName: Math.random() > 0.4 ? `Passenger ${i + 1}` : undefined,
        bookingId: Math.random() > 0.4 ? `BK${1000 + i}` : undefined
      }))
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out_of_service":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "on_trip":
        return "bg-blue-100 text-blue-800";
      case "off_duty":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || vehicle.maintenanceStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.maintenanceStatus === "active").length;
  const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacity, 0);
  const totalAvailableSeats = vehicles.reduce((sum, v) => sum + v.availableSeats, 0);
  const averageUtilization = vehicles.length > 0 
    ? vehicles.reduce((sum, v) => sum + v.utilizationRate, 0) / vehicles.length 
    : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vehicle availability...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Availability</h1>
            <p className="text-gray-600 mt-1">Monitor vehicle status and seat availability in real-time</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={fetchVehicleAvailability}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Vehicles</p>
                  <p className="text-2xl font-bold">{totalVehicles}</p>
                </div>
                <Truck className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Vehicles</p>
                  <p className="text-2xl font-bold text-green-600">{activeVehicles}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Seats</p>
                  <p className="text-2xl font-bold text-blue-600">{totalAvailableSeats}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Utilization</p>
                  <p className="text-2xl font-bold text-[#5d4a15]">{averageUtilization.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vehicle.make} {vehicle.model}</CardTitle>
                    <CardDescription>Plate: {vehicle.plateNumber}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(vehicle.maintenanceStatus)}>
                    {vehicle.maintenanceStatus.charAt(0).toUpperCase() + vehicle.maintenanceStatus.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vehicle Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Capacity</p>
                    <p className="font-medium">{vehicle.capacity} seats</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Available</p>
                    <p className="font-medium text-green-600">{vehicle.availableSeats} seats</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Occupied</p>
                    <p className="font-medium text-blue-600">{vehicle.occupiedSeats} seats</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Utilization</p>
                    <p className="font-medium">{vehicle.utilizationRate}%</p>
                  </div>
                </div>

                {/* Location & Next Trip */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Current Location</span>
                  </div>
                  <p className="text-sm text-gray-600">{vehicle.currentLocation}</p>
                  
                  {vehicle.nextTrip && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Next Trip</span>
                      </div>
                      <p className="text-sm text-gray-600">{vehicle.nextTrip.route}</p>
                      <p className="text-xs text-gray-500">Departure: {vehicle.nextTrip.departureTime}</p>
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                {vehicle.driver && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{vehicle.driver.name}</p>
                        <p className="text-sm text-gray-600">{vehicle.driver.phone}</p>
                      </div>
                      <Badge className={getDriverStatusColor(vehicle.driver.status)}>
                        {vehicle.driver.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowSeatMap(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Seats
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seat Map Modal */}
        {selectedVehicle && showSeatMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Seat Map - {selectedVehicle.make} {selectedVehicle.model}</CardTitle>
                    <CardDescription>Plate: {selectedVehicle.plateNumber}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setShowSeatMap(false)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Seat Map Visualization */}
                  <div className="text-center py-8 bg-gray-100 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                      <Truck className="h-5 w-5" />
                      <span className="font-medium">Driver</span>
                    </div>
                    
                    {/* Seat Grid */}
                    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                      {Array.from({ length: selectedVehicle.capacity }, (_, i) => {
                        const row = Math.floor(i / 4) + 1;
                        const col = String.fromCharCode(65 + (i % 4));
                        const seatNumber = `${row}${col}`;
                        const isOccupied = Math.random() > 0.6; // Mock occupancy
                        
                        return (
                          <div
                            key={i}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium ${
                              isOccupied 
                                ? 'bg-red-100 text-red-800 border border-red-200' 
                                : 'bg-green-100 text-green-800 border border-green-200'
                            }`}
                          >
                            {seatNumber}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                        <span>Occupied</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
