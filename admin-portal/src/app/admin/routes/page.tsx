"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal, AlertModal } from "@/components/ui/modal";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  DollarSign,
  Eye,
  MoreVertical,
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react";
import RouteDetailsModal from "@/components/RouteDetailsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

interface Route {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  basePrice: number;
  description?: string;
  isActive: boolean;
  _count?: {
    trips: number;
    bookings: number;
  };
  trips?: any[];
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showRouteDetailsModal, setShowRouteDetailsModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [newRoute, setNewRoute] = useState({
    from: '',
    to: '',
    distance: '',
    duration: '',
    price: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });
  
  // Modal states
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: () => {}
  });

  // Fetch routes data
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/routes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Format the data to match our Route interface
        const formattedRoutes: Route[] = data.map((route: any) => ({
          id: route.id,
          from: route.from,
          to: route.to,
          distance: `${route.distance} km`,
          duration: formatMinutesToDuration(route.duration),
          basePrice: route.basePrice,
          description: route.description,
          isActive: route.isActive,
          _count: route._count,
          trips: route.trips
        }));
        setRoutes(formattedRoutes);
      } else if (response.status === 401) {
        showAlert('Session Expired', 'Your session has expired. Please login again.', 'error');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showAlert('Error', 'Failed to fetch routes', 'error');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      showAlert('Connection Error', 'Failed to connect to server. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onConfirm?: () => void) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || (() => {})
    });
  };

  const handleAddRoute = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showAlert('Authentication Error', 'Please log in again to continue.', 'error', () => {
          localStorage.clear();
          window.location.href = '/';
        });
        return;
      }
      
      // Format data for backend API
      const routeData = {
        from: newRoute.from,
        to: newRoute.to,
        distance: parseInt(newRoute.distance),
        duration: parseDurationToMinutes(newRoute.duration),
        basePrice: parseFloat(newRoute.price.replace(/[₦,]/g, '')),
        description: newRoute.description || `Travel from ${newRoute.from} to ${newRoute.to}`,
        isActive: newRoute.status === 'active'
      };

      // Try to create or update route via backend API
      try {
        const url = isEditing && editingRouteId 
          ? `/api/v1/routes/${editingRouteId}`
          : '/api/v1/routes';
        
        const method = isEditing ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(routeData)
        });
        
        if (response.ok) {
          const routeResponse = await response.json();
          // Format the response to match our Route interface
          const formattedRoute: Route = {
            id: routeResponse.id,
            from: routeResponse.from,
            to: routeResponse.to,
            distance: `${routeResponse.distance} km`,
            duration: formatMinutesToDuration(routeResponse.duration),
            basePrice: routeResponse.basePrice,
            isActive: routeResponse.isActive,
            _count: routeResponse._count || { trips: 0, bookings: 0 },
            trips: routeResponse.trips || []
          };
          
          if (isEditing) {
            // Update existing route
            setRoutes(routes.map(route => 
              route.id === editingRouteId ? formattedRoute : route
            ));
            showAlert('Success', 'Route updated successfully!', 'success');
          } else {
            // Add new route
            setRoutes([...routes, formattedRoute]);
            showAlert('Success', 'Route added successfully!', 'success');
          }
          
          // Reset form and close modal
          setShowAddRouteModal(false);
          setIsEditing(false);
          setEditingRouteId(null);
          setNewRoute({
            from: '',
            to: '',
            distance: '',
            duration: '',
            price: '',
            description: '',
            status: 'active'
          });
          return;
        } else if (response.status === 401) {
          showAlert('Authentication Error', 'Your session has expired. Please log in again.', 'error', () => {
            localStorage.clear();
            window.location.href = '/';
          });
          return;
        } else {
          const errorData = await response.json();
          console.error('Backend API error:', errorData);
          showAlert('Error', `Failed to ${isEditing ? 'update' : 'create'} route: ${errorData.message || 'Unknown error'}`, 'error');
          return;
        }
      } catch (apiError) {
        console.error('Backend API failed:', apiError);
        showAlert('Connection Error', 'Unable to connect to server. Please check your connection and try again.', 'error');
        return;
      }
    } catch (error) {
      console.error('Error saving route:', error);
      showAlert('Error', 'An unexpected error occurred. Please try again.', 'error');
    }
  };

  // Helper function to parse duration string to minutes
  const parseDurationToMinutes = (duration: string): number => {
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      return hours * 60 + minutes;
    }
    return 480; // Default 8 hours
  };

  // Helper function to format minutes to duration string
  const formatMinutesToDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleViewRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      // Transform route data to match RouteDetailsModal interface
      const transformedRoute: any = {
        id: route.id,
        from: route.from,
        to: route.to,
        distance: route.distance,
        duration: route.duration,
        price: `₦${route.basePrice.toLocaleString()}`,
        status: route.isActive ? 'active' as const : 'inactive' as const,
        bookings: route._count?.bookings || 0,
        lastTrip: route.trips && route.trips.length > 0 
          ? new Date(route.trips[0].createdAt || Date.now()).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      };
      setSelectedRoute(transformedRoute);
      setShowRouteDetailsModal(true);
    }
  };

  const handleEditRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setNewRoute({
        from: route.from,
        to: route.to,
        distance: route.distance.replace(' km', ''), // Remove km suffix for editing
        duration: route.duration,
        price: route.basePrice.toString(), // Use basePrice
        description: route.description || '',
        status: route.isActive ? 'active' : 'inactive'
      });
      setIsEditing(true);
      setEditingRouteId(routeId);
      setShowAddRouteModal(true);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    showAlert(
      'Delete Route',
      'Are you sure you want to delete this route? This action cannot be undone.',
      'warning',
      async () => {
        try {
          const token = localStorage.getItem('adminToken');
          const response = await fetch(`/api/v1/routes/${routeId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            // Remove from local state
            setRoutes(routes.filter(r => r.id !== routeId));
            showAlert('Success', 'Route deleted successfully!', 'success');
          } else if (response.status === 401) {
            showAlert('Session Expired', 'Your session has expired. Please login again.', 'error', () => {
              localStorage.clear();
              window.location.href = '/';
            });
          } else {
            const errorData = await response.json();
            showAlert('Error', errorData.message || 'Failed to delete route', 'error');
          }
        } catch (error) {
          console.error('Error deleting route:', error);
          showAlert('Connection Error', 'Failed to connect to server. Please try again.', 'error');
        }
      }
    );
  };

  const handleViewAnalytics = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      showAlert('Analytics', `Analytics for route ${route.from} → ${route.to} will be displayed here.`, 'info');
    }
  };

  const handleViewBookings = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      showAlert('Bookings', `Bookings for route ${route.from} → ${route.to} will be displayed here.`, 'info');
    }
  };

  const handleScheduleTrips = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      showAlert('Schedule Trips', `Trip scheduling for route ${route.from} → ${route.to} will be displayed here.`, 'info');
    }
  };

  const columns: ColumnDef<Route>[] = [
    {
      accessorKey: "route",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Route
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const route = row.original;
        return (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[#5d4a15]" />
            <span className="font-medium">
              {route.from} → {route.to}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "distance",
      header: "Distance",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.getValue("distance")}</span>
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{row.getValue("duration")}</span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.getValue("price")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "bookings",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Bookings
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.getValue("bookings")}</span>
        </div>
      ),
    },
    {
      accessorKey: "lastTrip",
      header: "Last Trip",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("lastTrip")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const route = row.original;
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
                onClick={() => navigator.clipboard.writeText(route.id)}
              >
                Copy route ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewRoute(route.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditRoute(route.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit route
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteRoute(route.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete route
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
            <h1 className="text-3xl font-bold text-gray-900">Routes Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your travel routes</p>
          </div>
          <Button onClick={() => {
            setIsEditing(false);
            setEditingRouteId(null);
            setNewRoute({
              from: '',
              to: '',
              distance: '',
              duration: '',
              price: '',
              status: 'active'
            });
            setShowAddRouteModal(true);
          }} className="btn-golden">
            <Plus className="h-4 w-4 mr-2" />
            Add New Route
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routes.length}</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {routes.filter(route => route.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {routes.length > 0 ? Math.round((routes.filter(route => route.isActive).length / routes.length) * 100) : 0}% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦6,350</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {routes.reduce((sum, route) => sum + (route._count?.bookings || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Routes Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Routes</CardTitle>
            <CardDescription>
              A comprehensive list of all your travel routes with advanced filtering and sorting capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4a15]"></div>
                <span className="ml-2">Loading routes...</span>
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={routes} 
                searchKey="from"
                searchPlaceholder="Search routes by origin..."
              />
            )}
          </CardContent>
        </Card>

        {/* Add Route Modal */}
        <Modal
          isOpen={showAddRouteModal}
          onClose={() => {
            setShowAddRouteModal(false);
            setIsEditing(false);
            setEditingRouteId(null);
            setNewRoute({
              from: '',
              to: '',
              distance: '',
              duration: '',
              price: '',
              status: 'active'
            });
          }}
          title={isEditing ? "Edit Route" : "Add New Route"}
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              {isEditing ? "Update the travel route details" : "Create a new travel route with all necessary details"}
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">From</label>
                  <Input
                    placeholder="Origin city"
                    value={newRoute.from}
                    onChange={(e) => setNewRoute({...newRoute, from: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">To</label>
                  <Input
                    placeholder="Destination city"
                    value={newRoute.to}
                    onChange={(e) => setNewRoute({...newRoute, to: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Distance (km)</label>
                  <Input
                    placeholder="720"
                    value={newRoute.distance}
                    onChange={(e) => setNewRoute({...newRoute, distance: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    placeholder="8h 30m"
                    value={newRoute.duration}
                    onChange={(e) => setNewRoute({...newRoute, duration: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price (₦)</label>
                  <Input
                    placeholder="7500"
                    value={newRoute.price}
                    onChange={(e) => setNewRoute({...newRoute, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newRoute.status}
                    onChange={(e) => setNewRoute({...newRoute, status: e.target.value as 'active' | 'inactive'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[80px]"
                  placeholder="Brief description of this route (e.g., Comfortable journey through scenic highways)"
                  value={newRoute.description}
                  onChange={(e) => setNewRoute({...newRoute, description: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddRouteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddRoute}
                  className="flex-1"
                >
                  {isEditing ? "Save Changes" : "Add Route"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Route Details Modal */}
        <RouteDetailsModal
          route={selectedRoute}
          isOpen={showRouteDetailsModal}
          onClose={() => {
            setShowRouteDetailsModal(false);
            setSelectedRoute(null);
          }}
          onViewAnalytics={handleViewAnalytics}
          onViewBookings={handleViewBookings}
          onScheduleTrips={handleScheduleTrips}
          onEditRoute={handleEditRoute}
        />

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({...alertModal, isOpen: false})}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          onConfirm={alertModal.onConfirm}
          showCancel={alertModal.type === 'warning'}
          confirmText={alertModal.type === 'warning' ? 'Delete' : 'OK'}
        />
      </div>
    </AdminLayout>
  );
}