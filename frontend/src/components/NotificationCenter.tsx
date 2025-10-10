"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Clock, 
  Calendar,
  MapPin,
  Bus,
  CreditCard,
  Gift,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Settings,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  Loader2
} from "lucide-react";

interface Notification {
  id: string;
  type: "booking" | "payment" | "trip" | "promotion" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  metadata?: {
    bookingId?: string;
    tripId?: string;
    amount?: number;
    route?: string;
    date?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "booking" | "payment" | "trip" | "promotion" | "system">("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://engracedsmile.com/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // Fallback to mock data
        setNotifications(getMockNotifications());
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = (): Notification[] => [
    {
      id: "1",
      type: "booking",
      title: "Booking Confirmed",
      message: "Your booking for Lagos to Abuja has been confirmed. Departure: March 15, 2024 at 06:00 AM",
      timestamp: "2024-03-10T10:30:00Z",
      isRead: false,
      priority: "high",
      actionUrl: "/bookings",
      metadata: {
        bookingId: "ENG-123456",
        route: "Lagos → Abuja",
        date: "2024-03-15"
      }
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Successful",
      message: "Your payment of ₦15,000 has been processed successfully for booking ENG-123456",
      timestamp: "2024-03-10T10:25:00Z",
      isRead: true,
      priority: "high",
      actionUrl: "/bookings",
      metadata: {
        bookingId: "ENG-123456",
        amount: 15000
      }
    },
    {
      id: "3",
      type: "trip",
      title: "Trip Reminder",
      message: "Your trip to Abuja is tomorrow. Please arrive at the terminal 30 minutes before departure.",
      timestamp: "2024-03-14T18:00:00Z",
      isRead: false,
      priority: "medium",
      actionUrl: "/tracking",
      metadata: {
        tripId: "TRIP-001",
        route: "Lagos → Abuja",
        date: "2024-03-15"
      }
    },
    {
      id: "4",
      type: "promotion",
      title: "Special Offer",
      message: "Get 20% off your next booking! Use code SAVE20 at checkout. Valid until March 31, 2024.",
      timestamp: "2024-03-12T09:00:00Z",
      isRead: false,
      priority: "low",
      actionUrl: "/trips"
    },
    {
      id: "5",
      type: "system",
      title: "App Update Available",
      message: "A new version of the app is available with improved features and bug fixes.",
      timestamp: "2024-03-11T14:30:00Z",
      isRead: true,
      priority: "low"
    },
    {
      id: "6",
      type: "booking",
      title: "Seat Selection Reminder",
      message: "Don't forget to select your seats for your upcoming trip to Abuja. Seats are filling up fast!",
      timestamp: "2024-03-13T16:45:00Z",
      isRead: false,
      priority: "medium",
      actionUrl: "/booking",
      metadata: {
        bookingId: "ENG-123456",
        route: "Lagos → Abuja"
      }
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5" />;
      case "payment":
        return <CreditCard className="h-5 w-5" />;
      case "trip":
        return <Bus className="h-5 w-5" />;
      case "promotion":
        return <Gift className="h-5 w-5" />;
      case "system":
        return <Settings className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "booking":
        return "text-blue-600 bg-blue-100";
      case "payment":
        return "text-green-600 bg-green-100";
      case "trip":
        return "text-purple-600 bg-purple-100";
      case "promotion":
        return "text-orange-600 bg-orange-100";
      case "system":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://engracedsmile.com/api/v1/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update locally anyway
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('https://engracedsmile.com/api/v1/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Update locally anyway
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://engracedsmile.com/api/v1/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Update locally anyway
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === "all" || 
      (filter === "unread" && !notification.isRead) ||
      notification.type === filter;
    
    const matchesSearch = searchTerm === "" ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BellRing className="h-6 w-6 text-[#5d4a15]" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                  <p className="text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button variant="ghost" onClick={onClose} className="p-2">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "all" | "unread" | "booking" | "payment" | "trip" | "promotion" | "system")}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                  <option value="booking">Bookings</option>
                  <option value="payment">Payments</option>
                  <option value="trip">Trips</option>
                  <option value="promotion">Promotions</option>
                  <option value="system">System</option>
                </select>
                <Button 
                  variant="outline" 
                  onClick={fetchNotifications}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#5d4a15] mx-auto mb-4" />
                    <p className="text-gray-600">Loading notifications...</p>
                  </div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">
                    {searchTerm || filter !== "all" 
                      ? "No notifications match your current filter" 
                      : "You're all caught up! No new notifications."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        notification.isRead 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-[#5d4a15] shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                                )}
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {notification.type}
                                </Badge>
                              </div>
                              <p className={`text-sm mb-2 ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date(notification.timestamp).toLocaleString()}</span>
                                </div>
                                {notification.metadata?.route && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{notification.metadata.route}</span>
                                  </div>
                                )}
                                {notification.metadata?.amount && (
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-3 w-3" />
                                    <span>₦{notification.metadata.amount.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              {notification.actionUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    window.location.href = notification.actionUrl!;
                                    onClose();
                                  }}
                                  className="text-xs"
                                >
                                  View
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
