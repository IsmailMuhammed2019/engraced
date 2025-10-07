"use client";

import { useState, useEffect } from "react";
import { Bell, X, AlertCircle, CheckCircle, Info, Gift, Truck, DollarSign, Users, Car, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminNotification {
  id: string;
  type: "booking" | "payment" | "trip" | "driver" | "vehicle" | "route" | "system" | "customer";
  message: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionLink?: string;
  relatedId?: string;
  category: "new_booking" | "payment_received" | "trip_completed" | "driver_assigned" | "vehicle_maintenance" | "route_updated" | "system_alert" | "customer_support";
}

interface AdminNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
}


export default function AdminNotificationCenter({ isOpen, onClose, adminId }: AdminNotificationCenterProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, adminId]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getPriorityColor = (priority: AdminNotification["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "trip":
        return <Truck className="h-4 w-4" />;
      case "driver":
        return <Users className="h-4 w-4" />;
      case "vehicle":
        return <Car className="h-4 w-4" />;
      case "route":
        return <MapPin className="h-4 w-4" />;
      case "system":
        return <Info className="h-4 w-4" />;
      case "customer":
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesPriority = filterPriority === "all" || n.priority === filterPriority;
    const matchesSearch = n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesPriority && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
          >
            <Card className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Admin Notifications</CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close notifications">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow p-4 overflow-hidden">
                <div className="flex flex-col space-y-2 mb-4">
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex space-x-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="booking">Booking</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="trip">Trip</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="route">Route</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">{unreadCount} unread</p>
                  <Button variant="link" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                    Mark all as read
                  </Button>
                </div>

                <ScrollArea className="h-64">
                  {filteredNotifications.length === 0 ? (
                    <p className="text-center text-gray-500">No notifications found.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start space-x-3 p-3 rounded-md ${
                            notification.read ? "bg-gray-50" : "bg-blue-50"
                          } hover:bg-gray-100 transition-colors`}
                        >
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${getPriorityColor(notification.priority)}`} />
                          <div className="flex-grow">
                            <div className="flex items-center space-x-2 mb-1">
                              {getTypeIcon(notification.type)}
                              <p className={`text-sm ${notification.read ? "text-gray-600" : "font-medium text-gray-900"}`}>
                                {notification.message}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                            <div className="flex space-x-2 mt-2">
                              {!notification.read && (
                                <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                                  Mark as Read
                                </Button>
                              )}
                              {notification.actionLink && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={notification.actionLink}>View Details</a>
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
