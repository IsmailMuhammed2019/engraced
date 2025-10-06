"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
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
  ArrowUpDown,
  MoreHorizontal,
  Gauge,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import ImageViewer from "@/components/ImageViewer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  features: string[];
  mileage: number;
  lastService?: string;
  nextService?: string;
  isActive: boolean;
  tripsCount: number;
  images: string[];
  createdAt: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plateNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    features: [] as string[],
    mileage: 0,
    isActive: true
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Fetch vehicles data
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/vehicles', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      } else {
        console.error('Failed to fetch vehicles');
        // Fallback to mock data for development
        setVehicles(getMockVehicles());
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Fallback to mock data for development
      setVehicles(getMockVehicles());
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      setIsUploadingImages(true);
      
      // Upload vehicle images first if provided
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          const formData = new FormData();
          formData.append('image', image);
          formData.append('type', 'vehicle');
          
          const uploadResponse = await fetch('http://localhost:3003/api/v1/upload/vehicle', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: formData
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            imageUrls.push(uploadData.url);
          }
        }
      }

      const token = localStorage.getItem('adminToken');
      const vehicleData = {
        ...newVehicle,
        images: imageUrls
      };
      
      const response = await fetch('http://localhost:3003/api/v1/vehicles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });

      if (response.ok) {
        const data = await response.json();
        setVehicles(prev => [...prev, data]);
        setShowAddVehicleModal(false);
        setNewVehicle({
          plateNumber: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          capacity: 0,
          features: [],
          mileage: 0,
          isActive: true
        });
        setSelectedImages([]);
        alert('Vehicle added successfully!');
      } else {
        // Mock add for development
        const mockVehicle: Vehicle = {
          id: Date.now().toString(),
          ...newVehicle,
          isActive: true,
          tripsCount: 0,
          images: imageUrls,
          createdAt: new Date().toISOString()
        };
        setVehicles(prev => [...prev, mockVehicle]);
        setShowAddVehicleModal(false);
        setNewVehicle({
          plateNumber: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          capacity: 0,
          features: [],
          mileage: 0,
          isActive: true
        });
        setSelectedImages([]);
        alert('Vehicle added successfully! (Mock)');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleViewImages = (vehicle: Vehicle) => {
    if (vehicle.images && vehicle.images.length > 0) {
      setViewerImages(vehicle.images);
      setViewerIndex(0);
      setShowImageViewer(true);
    } else {
      alert('No images available for this vehicle');
    }
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    alert(`Viewing vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setNewVehicle({
      plateNumber: vehicle.plateNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      capacity: vehicle.capacity,
      features: vehicle.features,
      mileage: vehicle.mileage,
      isActive: vehicle.isActive
    });
    setShowAddVehicleModal(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    if (confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})?`)) {
      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
      alert('Vehicle deleted successfully!');
    }
  };

  // Mock data for development
  const getMockVehicles = (): Vehicle[] => [
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
      images: ["image1.jpg", "image2.jpg"],
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
      images: ["image3.jpg"],
      createdAt: "2024-01-10",
  },
  {
    id: "3",
      plateNumber: "DEF456CD",
      make: "Ford",
      model: "Transit",
      year: 2020,
      capacity: 8,
      features: ["AC", "WiFi", "USB Charging", "Reclining Seats", "Entertainment System"],
      mileage: 78000,
      lastService: "2024-01-20",
      nextService: "2024-07-20",
      isActive: true,
      tripsCount: 31,
      images: ["image4.jpg", "image5.jpg", "image6.jpg"],
      createdAt: "2024-01-05",
    },
    {
      id: "4",
      plateNumber: "GHI789EF",
      make: "Mercedes",
      model: "Sprinter",
    year: 2023,
      capacity: 9,
      features: ["AC", "WiFi", "USB Charging", "Reclining Seats", "Entertainment System", "Climate Control"],
      mileage: 12000,
      lastService: "2024-02-10",
      nextService: "2024-08-10",
    isActive: false,
      tripsCount: 5,
      images: [],
      createdAt: "2024-02-01",
    }
  ];

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default"><Car className="h-3 w-3 mr-1" />Active</Badge>
    ) : (
      <Badge variant="secondary"><Car className="h-3 w-3 mr-1" />Inactive</Badge>
    );
  };

  const getFeatureIcons = (features: string[]) => {
    const iconMap: { [key: string]: any } = {
      "AC": Snowflake,
      "WiFi": Wifi,
      "USB Charging": Wrench,
      "Reclining Seats": Users,
      "Entertainment System": Wifi,
      "Climate Control": Snowflake
    };

    return (
      <div className="flex flex-wrap gap-1">
        {features.slice(0, 3).map((feature, index) => {
          const Icon = iconMap[feature] || Wrench;
          return (
            <div key={index} className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded">
              <Icon className="h-3 w-3" />
              <span>{feature}</span>
            </div>
          );
        })}
        {features.length > 3 && (
          <div className="text-xs text-gray-500">+{features.length - 3} more</div>
        )}
      </div>
    );
  };

  const getServiceStatus = (lastService?: string, nextService?: string) => {
    if (!lastService || !nextService) return <span className="text-gray-500">No data</span>;
    
    const nextServiceDate = new Date(nextService);
    const today = new Date();
    const daysUntilService = Math.ceil((nextServiceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilService < 0) {
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
    } else if (daysUntilService <= 30) {
      return <Badge variant="secondary"><Wrench className="h-3 w-3 mr-1" />Due Soon</Badge>;
    } else {
      return <Badge variant="default"><Calendar className="h-3 w-3 mr-1" />Good</Badge>;
    }
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-[#5d4a15]" />
              <span className="font-medium">{vehicle.make} {vehicle.model}</span>
            </div>
            <div className="text-sm text-gray-500">
              {vehicle.plateNumber} • {vehicle.year}
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-xs">{vehicle.capacity} seats</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "features",
      header: "Features",
      cell: ({ row }) => getFeatureIcons(row.getValue("features")),
    },
    {
      accessorKey: "mileage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mileage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Gauge className="h-4 w-4 text-gray-400" />
          <span>{(row.getValue("mileage") as number).toLocaleString()} km</span>
        </div>
      ),
    },
    {
      accessorKey: "service",
      header: "Service Status",
      cell: ({ row }) => {
        const vehicle = row.original;
        return getServiceStatus(vehicle.lastService, vehicle.nextService);
      },
    },
    {
      accessorKey: "tripsCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trips
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.getValue("tripsCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("isActive")),
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => {
        const images = row.getValue("images") as string[];
        return (
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{images.length} photos</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const vehicle = row.original;
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
                onClick={() => navigator.clipboard.writeText(vehicle.id)}
              >
                Copy vehicle ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewImages(vehicle)}>
                <ImageIcon className="mr-2 h-4 w-4" />
                View images
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit vehicle
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Wrench className="mr-2 h-4 w-4" />
                Service history
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ImageIcon className="mr-2 h-4 w-4" />
                Manage images
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove vehicle
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
            <h1 className="text-3xl font-bold text-gray-900">Vehicles Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your vehicle fleet</p>
        </div>
          <Button 
            className="btn-golden"
            onClick={() => setShowAddVehicleModal(true)}
          >
          <Plus className="h-4 w-4 mr-2" />
            Add New Vehicle
        </Button>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
              <p className="text-xs text-muted-foreground">+1 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
              <Car className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles.filter(vehicle => vehicle.isActive).length}
                  </div>
              <p className="text-xs text-muted-foreground">
                {vehicles.length > 0 ? Math.round((vehicles.filter(vehicle => vehicle.isActive).length / vehicles.length) * 100) : 0}% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Due</CardTitle>
              <Wrench className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles.filter(vehicle => {
                  if (!vehicle.nextService) return false;
                  const nextServiceDate = new Date(vehicle.nextService);
                  const today = new Date();
                  const daysUntilService = Math.ceil((nextServiceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilService <= 30;
                }).length}
                    </div>
              <p className="text-xs text-muted-foreground">Within 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Calendar className="h-4 w-4 text-[#5d4a15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles.reduce((sum, vehicle) => sum + vehicle.tripsCount, 0)}
                    </div>
              <p className="text-xs text-muted-foreground">Completed trips</p>
              </CardContent>
            </Card>
        </div>

        {/* Vehicles Data Table */}
        <Card>
              <CardHeader>
            <CardTitle>Vehicles</CardTitle>
            <CardDescription>
              A comprehensive list of all vehicles in your fleet with maintenance schedules and performance metrics.
            </CardDescription>
              </CardHeader>
              <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4a15]"></div>
                <span className="ml-2">Loading vehicles...</span>
                  </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={vehicles} 
                searchKey="plateNumber"
                searchPlaceholder="Search by plate number..."
              />
            )}
              </CardContent>
            </Card>

            {/* Add Vehicle Modal */}
            {showAddVehicleModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Plate Number</label>
                      <input
                        type="text"
                        value={newVehicle.plateNumber}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, plateNumber: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter plate number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Make</label>
                        <input
                          type="text"
                          value={newVehicle.make}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter make"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Model</label>
                        <input
                          type="text"
                          value={newVehicle.model}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter model"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <input
                          type="number"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter year"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input
                          type="number"
                          value={newVehicle.capacity}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter capacity"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Features (comma-separated)</label>
                      <input
                        type="text"
                        value={newVehicle.features.join(', ')}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, features: e.target.value.split(',').map(f => f.trim()) }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="AC, WiFi, USB Charging"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mileage</label>
                      <input
                        type="number"
                        value={newVehicle.mileage}
                        onChange={(e) => setNewVehicle(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter mileage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Vehicle Images (up to 8)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 8) {
                            alert('Maximum 8 images allowed');
                            return;
                          }
                          setSelectedImages(files);
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                      {selectedImages.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">
                            Selected {selectedImages.length} image(s):
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <button
                                  onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddVehicleModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddVehicle}
                      disabled={isUploadingImages}
                      className="bg-[#5d4a15] hover:bg-[#6b5618]"
                    >
                      {isUploadingImages ? 'Uploading Images...' : 'Add Vehicle'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Image Viewer */}
            <ImageViewer
              isOpen={showImageViewer}
              onClose={() => setShowImageViewer(false)}
              images={viewerImages}
              currentIndex={viewerIndex}
              title="Vehicle Images"
            />
      </div>
    </AdminLayout>
  );
}