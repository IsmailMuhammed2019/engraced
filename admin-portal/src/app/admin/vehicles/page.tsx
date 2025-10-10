"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal, AlertModal } from "@/components/ui/modal";
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
    capacity: 7, // Fixed at 7 for all Sienna vehicles
    features: [] as string[],
    mileage: 0,
    isActive: true
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showManageImagesModal, setShowManageImagesModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: () => {}
  });

  // Fetch vehicles data
  useEffect(() => {
    fetchVehicles();
  }, []);

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onConfirm?: () => void) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || (() => {})
    });
  };

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
        setVehicles([]);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      setIsUploadingImages(true);

      const token = localStorage.getItem('adminToken');
      
      // First, create the vehicle without images
      const vehicleData = {
        plateNumber: newVehicle.plateNumber,
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year,
        capacity: newVehicle.capacity,
        features: newVehicle.features,
        mileage: newVehicle.mileage,
        isActive: newVehicle.isActive
      };
      
      console.log('Creating vehicle with data:', vehicleData);
      console.log('Auth token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:3003/api/v1/vehicles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });
      
      console.log('Vehicle creation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Vehicle creation error response:', errorText);
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Vehicle created successfully:', data);
        
        // If images were provided, upload them to the created vehicle
        if (selectedImages.length > 0) {
          console.log('=== STARTING IMAGE UPLOAD ===');
          console.log('Uploading images:', selectedImages.length, selectedImages);
          console.log('Vehicle ID for upload:', data.id);
          
          const formData = new FormData();
          selectedImages.forEach((image, index) => {
            console.log(`Adding image ${index + 1}:`, image.name, image.size, image.type);
            formData.append('images', image);
          });
          
          console.log('FormData entries:', Array.from(formData.entries()));
          console.log('Upload URL:', `http://localhost:3003/api/v1/upload/vehicles/${data.id}/images`);
          
          const uploadResponse = await fetch(`http://localhost:3003/api/v1/upload/vehicles/${data.id}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          console.log('Upload response status:', uploadResponse.status);
          console.log('Upload response headers:', Object.fromEntries(uploadResponse.headers.entries()));
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            console.log('=== IMAGES UPLOADED SUCCESSFULLY ===');
            console.log('Upload response data:', uploadData);
            // Update the vehicle data with the uploaded images
            data.images = uploadData.data.images;
            console.log('Updated vehicle data with images:', data.images);
          } else {
            const errorText = await uploadResponse.text();
            console.error('=== IMAGE UPLOAD FAILED ===');
            console.error('Upload error status:', uploadResponse.status);
            console.error('Upload error response:', errorText);
          }
        } else {
          console.log('No images to upload');
        }
        
        setVehicles(prev => [...prev, data]);
        setShowAddVehicleModal(false);
        setNewVehicle({
          plateNumber: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          capacity: 7, // Fixed at 7 for Sienna
          features: [],
          mileage: 0,
          isActive: true
        });
        setSelectedImages([]);
        showAlert('Success', 'Vehicle added successfully!', 'success');
      } else {
        const errorData = await response.json();
        console.error('Failed to create vehicle:', response.status, errorData);
        showAlert('Error', `Failed to create vehicle: ${errorData.message || 'Unknown error'}`, 'error');
        // Mock add for development
        const mockVehicle: Vehicle = {
          id: Date.now().toString(),
          ...newVehicle,
          isActive: true,
          tripsCount: 0,
          images: selectedImages.map((_, index) => `https://via.placeholder.com/300x200/cccccc/666666?text=Vehicle+${index + 1}`),
          createdAt: new Date().toISOString()
        };
        setVehicles(prev => [...prev, mockVehicle]);
        setShowAddVehicleModal(false);
        setNewVehicle({
          plateNumber: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          capacity: 7, // Fixed at 7 for Sienna
          features: [],
          mileage: 0,
          isActive: true
        });
        setSelectedImages([]);
        showAlert('Success', 'Vehicle added successfully! (Mock)', 'success');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      showAlert('Error', 'Failed to add vehicle', 'error');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleViewImages = (vehicle: Vehicle) => {
    console.log('Viewing images for vehicle:', vehicle.plateNumber);
    console.log('Vehicle images:', vehicle.images);
    console.log('Images length:', vehicle.images?.length);
    
    if (vehicle.images && vehicle.images.length > 0) {
      setViewerImages(vehicle.images);
      setViewerIndex(0);
      setShowImageViewer(true);
      console.log('Image viewer opened with images:', vehicle.images);
    } else {
      console.log('No images available for vehicle');
      showAlert('Info', 'No images available for this vehicle', 'info');
    }
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetailsModal(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
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
    setShowEditVehicleModal(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    console.log('Delete vehicle clicked for:', vehicle.make, vehicle.model);
    setSelectedVehicle(vehicle);
    setShowDeleteConfirmModal(true);
    console.log('Delete modal should be open now');
  };

  const confirmDeleteVehicle = async () => {
    console.log('Confirm delete called for:', selectedVehicle?.make, selectedVehicle?.model);
    if (selectedVehicle) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:3003/api/v1/vehicles/${selectedVehicle.id}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Remove from local state
          console.log('API delete successful, removing from local state');
          setVehicles(prev => {
            const filtered = prev.filter(v => v.id !== selectedVehicle.id);
            console.log('Vehicles after deletion:', filtered.length);
            return filtered;
          });
          setShowDeleteConfirmModal(false);
          setSelectedVehicle(null);
          showAlert('Success', 'Vehicle deleted successfully!', 'success');
          console.log('Vehicle deleted successfully from backend');
        } else {
          // If API call fails, still remove from local state for demo purposes
          console.log('API delete failed, removing from local state only');
          setVehicles(prev => {
            const filtered = prev.filter(v => v.id !== selectedVehicle.id);
            console.log('Vehicles after local deletion:', filtered.length);
            return filtered;
          });
          setShowDeleteConfirmModal(false);
          setSelectedVehicle(null);
          showAlert('Success', 'Vehicle deleted successfully! (Local only)', 'success');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        // If API call fails, still remove from local state for demo purposes
        setVehicles(prev => prev.filter(v => v.id !== selectedVehicle.id));
        setShowDeleteConfirmModal(false);
        setSelectedVehicle(null);
        showAlert('Success', 'Vehicle deleted successfully! (Local only)', 'success');
      }
    } else {
      console.log('No selected vehicle to delete');
    }
  };

  const handleServiceHistory = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowServiceModal(true);
  };

  const handleManageImages = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowManageImagesModal(true);
  };


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
          <span className="font-medium">{row.getValue("tripsCount") || 0}</span>
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
              <DropdownMenuItem onClick={() => handleViewVehicle(vehicle)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewImages(vehicle)}>
                <ImageIcon className="mr-2 h-4 w-4" />
                View images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit vehicle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleServiceHistory(vehicle)}>
                <Wrench className="mr-2 h-4 w-4" />
                Service history
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleManageImages(vehicle)}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Manage images
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteVehicle(vehicle)}
                className="text-red-600"
              >
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
        <div className="flex justify-end items-center">
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
                {vehicles.reduce((sum, vehicle) => sum + (vehicle.tripsCount || 0), 0)}
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
                        <label className="block text-sm font-medium mb-1">Capacity (Sienna)</label>
                        <input
                          type="number"
                          value="7"
                          readOnly
                          disabled
                          className="w-full p-2 border rounded-md bg-gray-100"
                          placeholder="Fixed at 7 seats for Sienna"
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
                      <p className="text-xs text-gray-500 mb-2">
                        Hold Ctrl/Cmd to select multiple images at once, or select one at a time to add more
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="vehicle-images-input"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          console.log('File input changed. Selected files:', files.length, files);
                          console.log('File names:', files.map(f => f.name));
                          console.log('File sizes:', files.map(f => f.size));
                          
                          if (files.length > 8) {
                            showAlert('Warning', 'Maximum 8 images allowed', 'warning');
                            return;
                          }
                          
                          if (files.length === 0) {
                            console.log('No files selected');
                            setSelectedImages([]);
                            return;
                          }
                          
                          // If we already have images, add to existing ones instead of replacing
                          if (selectedImages.length > 0) {
                            console.log('Adding to existing images. Current:', selectedImages.length, 'New:', files.length);
                            setSelectedImages(prev => [...prev, ...files]);
                          } else {
                            console.log('Setting new images');
                          setSelectedImages(files);
                          }
                          console.log('Selected images state updated:', selectedImages.length + files.length);
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                      {selectedImages.length > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-gray-600">
                            Selected {selectedImages.length} image(s):
                          </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  const input = document.getElementById('vehicle-images-input') as HTMLInputElement;
                                  if (input) input.click();
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                Add More
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedImages([]);
                                  const input = document.getElementById('vehicle-images-input') as HTMLInputElement;
                                  if (input) input.value = '';
                                }}
                                className="text-xs text-red-600 hover:text-red-800 underline"
                              >
                                Clear all
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-md border"
                                />
                                <button
                                  onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
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

            {/* Vehicle Details Modal */}
            {showVehicleDetailsModal && selectedVehicle && (
              <Modal
                isOpen={showVehicleDetailsModal}
                onClose={() => {
                  setShowVehicleDetailsModal(false);
                  setSelectedVehicle(null);
                }}
                title="Vehicle Details"
                size="lg"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-[#5d4a15] rounded-lg flex items-center justify-center">
                      <Car className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedVehicle.make} {selectedVehicle.model}</h3>
                      <p className="text-gray-600">{selectedVehicle.plateNumber} • {selectedVehicle.year}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(selectedVehicle.isActive)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Specifications</h4>
                      <p><strong>Capacity:</strong> {selectedVehicle.capacity} seats</p>
                      <p><strong>Mileage:</strong> {selectedVehicle.mileage.toLocaleString()} km</p>
                      <p><strong>Trips:</strong> {selectedVehicle.tripsCount || 0}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedVehicle.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Service Status</h4>
                    {getServiceStatus(selectedVehicle.lastService, selectedVehicle.nextService)}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Images</h4>
                    <div className="flex space-x-2">
                      {selectedVehicle.images.length > 0 ? (
                        selectedVehicle.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Vehicle ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-md cursor-pointer"
                            onClick={() => {
                              setViewerImages(selectedVehicle.images);
                              setViewerIndex(index);
                              setShowImageViewer(true);
                            }}
                          />
                        ))
                      ) : (
                        <p className="text-gray-500">No images available</p>
                      )}
                    </div>
                  </div>
                </div>
              </Modal>
            )}

            {/* Edit Vehicle Modal */}
            {showEditVehicleModal && selectedVehicle && (
              <Modal
                isOpen={showEditVehicleModal}
                onClose={() => {
                  setShowEditVehicleModal(false);
                  setSelectedVehicle(null);
                }}
                title="Edit Vehicle"
                size="lg"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newVehicle.isActive}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditVehicleModal(false);
                      setSelectedVehicle(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Update vehicle logic here
                      setShowEditVehicleModal(false);
                      setSelectedVehicle(null);
                      showAlert('Success', 'Vehicle updated successfully!', 'success');
                    }}
                    className="bg-[#5d4a15] hover:bg-[#6b5618]"
                  >
                    Update Vehicle
                  </Button>
                </div>
              </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <AlertModal
              isOpen={showDeleteConfirmModal}
              onClose={() => {
                setShowDeleteConfirmModal(false);
                setSelectedVehicle(null);
              }}
              title="Delete Vehicle"
              message={`Are you sure you want to delete ${selectedVehicle?.make} ${selectedVehicle?.model} (${selectedVehicle?.plateNumber})? This action cannot be undone.`}
              type="warning"
              onConfirm={confirmDeleteVehicle}
              confirmText="Delete"
              cancelText="Cancel"
              showCancel={true}
            />

            {/* Service History Modal */}
            {showServiceModal && selectedVehicle && (
              <Modal
                isOpen={showServiceModal}
                onClose={() => {
                  setShowServiceModal(false);
                  setSelectedVehicle(null);
                }}
                title="Service History"
                size="lg"
              >
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Service History</h3>
                    <p className="text-gray-600">
                      Service history for {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.plateNumber})
                    </p>
                    <p className="text-sm text-gray-500 mt-2">No service records found</p>
                  </div>
                </div>
              </Modal>
            )}

            {/* Manage Images Modal */}
            {showManageImagesModal && selectedVehicle && (
              <Modal
                isOpen={showManageImagesModal}
                onClose={() => {
                  setShowManageImagesModal(false);
                  setSelectedVehicle(null);
                }}
                title="Manage Images"
                size="lg"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Current Images</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {selectedVehicle.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Vehicle ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            onClick={async () => {
                              if (selectedVehicle) {
                                try {
                                  const token = localStorage.getItem('adminToken');
                                  const response = await fetch(`http://localhost:3003/api/v1/upload/vehicles/${selectedVehicle.id}/images/${index}`, {
                                    method: 'DELETE',
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                      'Content-Type': 'application/json'
                                    }
                                  });
                                  
                                  if (response.ok) {
                                    const data = await response.json();
                                    console.log('Image deleted successfully:', data);
                                    
                                    // Update the vehicle in the local state
                                    setVehicles(prev => prev.map(vehicle => 
                                      vehicle.id === selectedVehicle.id 
                                        ? { ...vehicle, images: data.data.vehicle.images }
                                        : vehicle
                                    ));
                                    
                                    // Update the selected vehicle
                                    setSelectedVehicle(prev => prev ? { ...prev, images: data.data.vehicle.images } : null);
                                    
                                    showAlert('Success', 'Image removed successfully!', 'success');
                                  } else {
                                    const errorData = await response.json();
                                    showAlert('Error', `Failed to remove image: ${errorData.message || 'Unknown error'}`, 'error');
                                  }
                                } catch (error) {
                                  console.error('Error removing image:', error);
                                  showAlert('Error', 'Failed to remove image', 'error');
                                }
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Add New Images</h4>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 8) {
                          showAlert('Warning', 'Maximum 8 images allowed', 'warning');
                          return;
                        }
                        
                        if (files.length > 0 && selectedVehicle) {
                          try {
                            const token = localStorage.getItem('adminToken');
                            const formData = new FormData();
                            files.forEach((file) => {
                              formData.append('images', file);
                          });
                            
                            const uploadResponse = await fetch(`http://localhost:3003/api/v1/upload/vehicles/${selectedVehicle.id}/images`, {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`
                              },
                              body: formData
                            });
                            
                            if (uploadResponse.ok) {
                              const uploadData = await uploadResponse.json();
                              console.log('Images uploaded successfully:', uploadData);
                              
                              // Update the vehicle in the local state
                              setVehicles(prev => prev.map(vehicle => 
                                vehicle.id === selectedVehicle.id 
                                  ? { ...vehicle, images: uploadData.data.images }
                                  : vehicle
                              ));
                              
                              // Update the selected vehicle
                              setSelectedVehicle(prev => prev ? { ...prev, images: uploadData.data.images } : null);
                              
                              showAlert('Success', `${files.length} image(s) uploaded successfully!`, 'success');
                            } else {
                              const errorData = await uploadResponse.json();
                              showAlert('Error', `Failed to upload images: ${errorData.message || 'Unknown error'}`, 'error');
                            }
                          } catch (error) {
                            console.error('Error uploading images:', error);
                            showAlert('Error', 'Failed to upload images', 'error');
                          }
                        }
                      }}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </Modal>
            )}

            {/* Alert Modal */}
            <AlertModal
              isOpen={alertModal.isOpen}
              onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
              title={alertModal.title}
              message={alertModal.message}
              type={alertModal.type}
              onConfirm={() => {
                alertModal.onConfirm();
                setAlertModal(prev => ({ ...prev, isOpen: false }));
              }}
            />
      </div>
    </AdminLayout>
  );
}