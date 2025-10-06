"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Navigation,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Phone,
  User,
  Star,
  RefreshCw,
  Share2,
  Download,
  Bell,
  BellRing,
  ArrowLeft,
  ArrowRight,
  Timer,
  Shield,
  Wifi,
  Battery,
  Signal,
  Camera,
  MessageCircle,
  HelpCircle,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

interface TripStatus {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: string;
  completed: boolean;
}

interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  experience: number;
  photo?: string;
  licenseNumber: string;
}

interface VehicleInfo {
  make: string;
  model: string;
  plateNumber: string;
  color: string;
  features: string[];
  capacity: number;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface TripDetails {
  id: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  estimatedArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  status: "scheduled" | "boarding" | "departed" | "in-transit" | "arrived" | "completed";
  progress: number;
  currentLocation: string;
  nextStop?: string;
  driver: DriverInfo;
  vehicle: VehicleInfo;
  passengers: number;
  seat: string;
  price: string;
  trackingNumber: string;
}

export default function TrackingPage() {
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [tripStatus, setTripStatus] = useState<TripStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Check if tracking number is in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const tracking = urlParams.get('tracking');
    if (tracking) {
      setTrackingNumber(tracking);
      fetchTripDetails(tracking);
    }
  }, []);

  useEffect(() => {
    if (autoRefresh && tripDetails) {
      const interval = setInterval(() => {
        fetchTripDetails(tripDetails.trackingNumber);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, tripDetails]);

  const fetchTripDetails = async (trackingNum: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/v1/trips/track/${trackingNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTripDetails(data);
        setTripStatus(data.statusHistory || getMockTripStatus());
      } else {
        // Fallback to mock data
        setTripDetails(getMockTripDetails());
        setTripStatus(getMockTripStatus());
      }
    } catch (error) {
      console.error('Error fetching trip details:', error);
      setTripDetails(getMockTripDetails());
      setTripStatus(getMockTripStatus());
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  const getMockTripDetails = (): TripDetails => ({
    id: "TRK123456789",
    route: "Lagos to Abuja",
    from: "Lagos",
    to: "Abuja",
    departureTime: "2024-01-15 08:00",
    estimatedArrival: "2024-01-15 16:00",
    actualDeparture: "2024-01-15 08:15",
    status: "in-transit",
    progress: 65,
    currentLocation: "Lokoja",
    nextStop: "Abuja",
    driver: {
      name: "John Doe",
      phone: "+2348071116229",
      rating: 4.8,
      experience: 5,
      licenseNumber: "DL123456789"
    },
    vehicle: {
      make: "Toyota",
      model: "Sienna",
      plateNumber: "ABC123XY",
      color: "White",
      features: ["AC", "WiFi", "USB Charging", "Reclining Seats"],
      capacity: 7,
      currentLocation: {
        lat: 7.8019,
        lng: 6.7448,
        address: "Lokoja, Kogi State"
      }
    },
    passengers: 6,
    seat: "A12",
    price: "₦15,000",
    trackingNumber: "TRK123456789"
  });

  const getMockTripStatus = (): TripStatus[] => [
    {
      id: "1",
      status: "departed",
      location: "Lagos Terminal",
      timestamp: "2024-01-15 08:15",
      description: "Trip departed from Lagos Terminal",
      icon: "truck",
      completed: true
    },
    {
      id: "2",
      status: "in-transit",
      location: "Ibadan",
      timestamp: "2024-01-15 10:30",
      description: "Passing through Ibadan",
      icon: "navigation",
      completed: true
    },
    {
      id: "3",
      status: "in-transit",
      location: "Lokoja",
      timestamp: "2024-01-15 13:45",
      description: "Currently in Lokoja",
      icon: "navigation",
      completed: true
    },
    {
      id: "4",
      status: "in-transit",
      location: "Abuja",
      timestamp: "2024-01-15 16:00",
      description: "Approaching Abuja",
      icon: "navigation",
      completed: false
    }
  ];

  const getStatusIcon = (icon: string) => {
    switch (icon) {
      case "truck":
        return <Truck className="h-4 w-4" />;
      case "navigation":
        return <Navigation className="h-4 w-4" />;
      case "check-circle":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "departed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "arrived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleTrackTrip = () => {
    if (trackingNumber.trim()) {
      fetchTripDetails(trackingNumber.trim());
    }
  };

  const handleCallDriver = () => {
    if (tripDetails?.driver.phone) {
      window.open(`tel:${tripDetails.driver.phone}`);
    }
  };

  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: `Track my trip - ${tripDetails?.route}`,
        text: `I'm traveling from ${tripDetails?.from} to ${tripDetails?.to}. Track my journey:`,
        url: `${window.location.origin}/tracking?tracking=${tripDetails?.trackingNumber}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/tracking?tracking=${tripDetails?.trackingNumber}`);
    }
  };

  if (loading && !tripDetails) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Trip Tracking</h1>
                <p className="text-gray-600 mt-1">Real-time tracking of your journey</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? "bg-green-50 text-green-700 border-green-200" : ""}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
                  {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          {!tripDetails && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Track Your Trip</CardTitle>
                <CardDescription>Enter your tracking number to view real-time trip status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter tracking number..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleTrackTrip} className="bg-[#5d4a15] hover:bg-[#6b5618]">
                    <Navigation className="h-4 w-4 mr-2" />
                    Track Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trip Details */}
          {tripDetails && (
            <div className="space-y-8">
              {/* Trip Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{tripDetails.route}</CardTitle>
                      <CardDescription>
                        Tracking Number: {tripDetails.trackingNumber}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleShareTrip}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white rounded-lg">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-lg font-bold">{tripDetails.progress}%</p>
                      <p className="text-sm opacity-90">Progress</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-[#5d4a15]" />
                      <p className="text-lg font-bold">{tripDetails.currentLocation}</p>
                      <p className="text-sm text-gray-600">Current Location</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Timer className="h-8 w-8 mx-auto mb-2 text-[#5d4a15]" />
                      <p className="text-lg font-bold">{tripDetails.estimatedArrival}</p>
                      <p className="text-sm text-gray-600">ETA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Bar */}
              <Card>
                <CardHeader>
                  <CardTitle>Journey Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{tripDetails.from}</span>
                      <span className="font-medium">{tripDetails.to}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${tripDetails.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Departure: {tripDetails.departureTime}</span>
                      <span>Arrival: {tripDetails.estimatedArrival}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-[#5d4a15] rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {tripDetails.driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{tripDetails.driver.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{tripDetails.driver.rating}</span>
                          </div>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-600">
                            {tripDetails.driver.experience} years experience
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          License: {tripDetails.driver.licenseNumber}
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleCallDriver} className="bg-[#5d4a15] hover:bg-[#6b5618]">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Driver
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {tripDetails.vehicle.make} {tripDetails.vehicle.model}
                      </h3>
                      <p className="text-gray-600 mb-2">Plate: {tripDetails.vehicle.plateNumber}</p>
                      <p className="text-gray-600 mb-4">Color: {tripDetails.vehicle.color}</p>
                      <div className="flex flex-wrap gap-2">
                        {tripDetails.vehicle.features.map((feature, index) => (
                          <Badge key={index} className="bg-[#5d4a15] text-white">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="space-y-2">
                        <div className="flex items-center justify-end space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{tripDetails.passengers}/{tripDetails.vehicle.capacity} passengers</span>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{tripDetails.vehicle.currentLocation.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Status Timeline</CardTitle>
                  <CardDescription>Real-time updates of your journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tripStatus.map((status, index) => (
                      <div key={status.id} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          status.completed 
                            ? 'bg-[#5d4a15] text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {getStatusIcon(status.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{status.description}</h3>
                            <Badge className={getStatusColor(status.status)}>
                              {status.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{status.location}</p>
                          <p className="text-xs text-gray-500 mt-1">{status.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Last Updated */}
              <div className="text-center text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {autoRefresh && (
                  <span className="ml-2 text-green-600">
                    • Auto-refresh enabled
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
