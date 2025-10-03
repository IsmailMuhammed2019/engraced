"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Car,
  Calendar,
  Wrench,
  Users,
  Wifi,
  Snowflake,
} from "lucide-react";

// Mock data - replace with real API calls
const mockVehicles = [
  {
    id: "1",
    plateNumber: "ABC123XY",
    make: "Toyota",
    model: "Sienna",
    year: 2022,
    capacity: 7,
    features: ["AC", "WiFi", "USB Charging", "Reclining Seats"],
    mileage: 45000,
    lastService: "2024-01-15",
    nextService: "2024-07-15",
    isActive: true,
    tripsCount: 23,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    plateNumber: "XYZ789AB",
    make: "Toyota",
    model: "Sienna",
    year: 2021,
    capacity: 7,
    features: ["AC", "WiFi", "USB Charging"],
    mileage: 62000,
    lastService: "2024-02-01",
    nextService: "2024-08-01",
    isActive: true,
    tripsCount: 18,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    plateNumber: "DEF456GH",
    make: "Toyota",
    model: "Sienna",
    year: 2023,
    capacity: 7,
    features: ["AC", "WiFi", "USB Charging", "Reclining Seats", "Entertainment"],
    mileage: 28000,
    lastService: "2024-03-10",
    nextService: "2024-09-10",
    isActive: false,
    tripsCount: 12,
    createdAt: "2024-02-10",
  },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plateNumber: "",
    make: "",
    model: "",
    year: "",
    capacity: "",
    features: [] as string[],
    mileage: "",
    lastService: "",
    nextService: "",
  });
  const [currentFeature, setCurrentFeature] = useState("");

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVehicleStatus = (id: string) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, isActive: !vehicle.isActive } : vehicle
      )
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setNewVehicle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (currentFeature.trim() && !newVehicle.features.includes(currentFeature.trim())) {
      setNewVehicle(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setNewVehicle(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newVehicle.plateNumber || !newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.capacity) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new vehicle
    const vehicle = {
      id: (vehicles.length + 1).toString(),
      ...newVehicle,
      year: parseInt(newVehicle.year),
      capacity: parseInt(newVehicle.capacity),
      mileage: parseInt(newVehicle.mileage) || 0,
      isActive: true,
      tripsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Add to vehicles list
    setVehicles([...vehicles, vehicle]);

    // Reset form
    setNewVehicle({
      plateNumber: "",
      make: "",
      model: "",
      year: "",
      capacity: "",
      features: [],
      mileage: "",
      lastService: "",
      nextService: "",
    });

    // Close form
    setShowCreateForm(false);
    
    // Show success message
    alert("Vehicle created successfully!");
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "ac":
        return <Snowflake className="h-4 w-4" />;
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search and Add Button */}
        <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="btn-golden">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-[#5d4a15] flex items-center justify-center">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vehicle.plateNumber}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={vehicle.isActive ? "default" : "secondary"}
                    className={
                      vehicle.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {vehicle.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Capacity</span>
                    <span className="font-semibold">{vehicle.capacity} seats</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Mileage</span>
                    <span className="font-semibold">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Features</p>
                    <div className="flex flex-wrap gap-1">
                      {vehicle.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <span className="flex items-center space-x-1">
                            {getFeatureIcon(feature)}
                            <span>{feature}</span>
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total Trips</p>
                      <p className="font-semibold">{vehicle.tripsCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Next Service</p>
                      <p className="font-semibold">{vehicle.nextService}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVehicleStatus(vehicle.id)}
                      className={
                        vehicle.isActive
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Vehicle Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateVehicle} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Plate Number</label>
                    <Input 
                      placeholder="ABC123XY" 
                      value={newVehicle.plateNumber}
                      onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Make</label>
                      <Input 
                        placeholder="Toyota" 
                        value={newVehicle.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Model</label>
                      <Input 
                        placeholder="Sienna" 
                        value={newVehicle.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <Input 
                      type="number" 
                      placeholder="2022" 
                      value={newVehicle.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Capacity</label>
                    <Input 
                      type="number" 
                      placeholder="7" 
                      value={newVehicle.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Features Section */}
                  <div>
                    <label className="text-sm font-medium">Vehicle Features</label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        placeholder="e.g., AC, WiFi, USB Charging" 
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature} className="btn-golden">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Display selected features */}
                    {newVehicle.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newVehicle.features.map((feature, index) => (
                          <Badge key={index} className="bg-[#5d4a15] text-white flex items-center gap-1">
                            {getFeatureIcon(feature)}
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(feature)}
                              className="ml-1 hover:text-red-200"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mileage</label>
                    <Input 
                      type="number" 
                      placeholder="45000" 
                      value={newVehicle.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Last Service</label>
                      <Input 
                        type="date" 
                        value={newVehicle.lastService}
                        onChange={(e) => handleInputChange('lastService', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Next Service</label>
                      <Input 
                        type="date" 
                        value={newVehicle.nextService}
                        onChange={(e) => handleInputChange('nextService', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 btn-golden">Add Vehicle</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
