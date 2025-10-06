"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
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
  price: string;
  status: "active" | "inactive";
  bookings: number;
  lastTrip: string;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    from: '',
    to: '',
    distance: '',
    duration: '',
    price: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Fetch routes data
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/routes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      } else {
        console.error('Failed to fetch routes');
        // Fallback to mock data for development
        setRoutes(getMockRoutes());
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      // Fallback to mock data for development
      setRoutes(getMockRoutes());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const getMockRoutes = (): Route[] => [
    {
      id: "1",
      from: "Lagos",
      to: "Abuja",
      distance: "720 km",
      duration: "8h 30m",
      price: "₦7,500",
      status: "active",
      bookings: 234,
      lastTrip: "2024-01-15"
    },
    {
      id: "2",
      from: "Lagos",
      to: "Port Harcourt",
      distance: "540 km",
      duration: "6h 00m",
      price: "₦6,200",
      status: "active",
      bookings: 189,
      lastTrip: "2024-01-15"
    },
    {
      id: "3",
      from: "Abuja",
      to: "Kaduna",
      distance: "200 km",
      duration: "2h 15m",
      price: "₦3,200",
      status: "active",
      bookings: 156,
      lastTrip: "2024-01-14"
    },
    {
      id: "4",
      from: "Enugu",
      to: "Lagos",
      distance: "750 km",
      duration: "9h 30m",
      price: "₦8,500",
      status: "inactive",
      bookings: 98,
      lastTrip: "2024-01-10"
    }
  ];

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

  const handleAddRoute = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/routes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRoute)
      });
      
      if (response.ok) {
        const addedRoute = await response.json();
        setRoutes([...routes, addedRoute]);
        setShowAddRouteModal(false);
        setNewRoute({
          from: '',
          to: '',
          distance: '',
          duration: '',
          price: '',
          status: 'active'
        });
      } else {
        // Fallback: add to local state for development
        const mockRoute: Route = {
          id: (routes.length + 1).toString(),
          from: newRoute.from,
          to: newRoute.to,
          distance: newRoute.distance,
          duration: newRoute.duration,
          price: newRoute.price,
          status: newRoute.status,
          bookings: 0,
          lastTrip: new Date().toISOString().split('T')[0]
        };
        setRoutes([...routes, mockRoute]);
        setShowAddRouteModal(false);
        setNewRoute({
          from: '',
          to: '',
          distance: '',
          duration: '',
          price: '',
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Error adding route:', error);
      // Fallback: add to local state for development
      const mockRoute: Route = {
        id: (routes.length + 1).toString(),
        from: newRoute.from,
        to: newRoute.to,
        distance: newRoute.distance,
        duration: newRoute.duration,
        price: newRoute.price,
        status: newRoute.status,
        bookings: 0,
        lastTrip: new Date().toISOString().split('T')[0]
      };
      setRoutes([...routes, mockRoute]);
      setShowAddRouteModal(false);
      setNewRoute({
        from: '',
        to: '',
        distance: '',
        duration: '',
        price: '',
        status: 'active'
      });
    }
  };

  const handleViewRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      alert(`Viewing route: ${route.from} → ${route.to}\nDistance: ${route.distance}\nDuration: ${route.duration}\nPrice: ${route.price}`);
    }
  };

  const handleEditRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setNewRoute({
        from: route.from,
        to: route.to,
        distance: route.distance,
        duration: route.duration,
        price: route.price,
        status: route.status
      });
      setShowAddRouteModal(true);
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(r => r.id !== routeId));
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
          <Button onClick={() => setShowAddRouteModal(true)} className="btn-golden">
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
                {routes.filter(route => route.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {routes.length > 0 ? Math.round((routes.filter(route => route.status === "active").length / routes.length) * 100) : 0}% active rate
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
                {routes.reduce((sum, route) => sum + route.bookings, 0)}
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
        {showAddRouteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Add New Route</CardTitle>
                <CardDescription>
                  Create a new travel route with all necessary details
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                      Add Route
                    </Button>
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