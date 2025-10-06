"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";

interface Notification {
  id: string;
  type: "booking" | "payment" | "trip" | "promotion" | "system" | "rating" | "chat";
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
    rating?: number;
    chatId?: string;
  };
}

interface NotificationBellProps {
  userId: string;
  userType: "customer" | "admin";
  className?: string;
}

export default function NotificationBell({ userId, userType, className = "" }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Set up real-time updates
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [userId, userType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem(userType === 'admin' ? 'adminToken' : 'token');
      const response = await fetch(`http://localhost:3003/api/v1/notifications/${userType}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      } else {
        // Fallback to mock data
        const mockNotifications = getMockNotifications();
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      const mockNotifications = getMockNotifications();
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = (): Notification[] => {
    const baseNotifications: Notification[] = [
      {
        id: "1",
        type: "booking",
        title: "Booking Confirmed",
        message: "Your booking for Lagos to Abuja has been confirmed. Departure: March 15, 2024 at 06:00 AM",
        timestamp: new Date(Date.now() - 300000).toISOString(),
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
        timestamp: new Date(Date.now() - 600000).toISOString(),
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
        timestamp: new Date(Date.now() - 900000).toISOString(),
        isRead: false,
        priority: "medium",
        actionUrl: "/tracking",
        metadata: {
          tripId: "TRIP-001",
          route: "Lagos → Abuja",
          date: "2024-03-15"
        }
      }
    ];

    if (userType === 'admin') {
      baseNotifications.push(
        {
          id: "4",
          type: "system",
          title: "New Booking Alert",
          message: "A new booking has been made for Lagos to Abuja route. Booking ID: ENG-789012",
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          isRead: false,
          priority: "high",
          actionUrl: "/admin/bookings",
          metadata: {
            bookingId: "ENG-789012",
            route: "Lagos → Abuja"
          }
        },
        {
          id: "5",
          type: "chat",
          title: "New Support Message",
          message: "Customer John Doe has sent a new support message regarding booking ENG-123456",
          timestamp: new Date(Date.now() - 1500000).toISOString(),
          isRead: false,
          priority: "medium",
          actionUrl: "/admin/support",
          metadata: {
            chatId: "CHAT-001",
            bookingId: "ENG-123456"
          }
        }
      );
    } else {
      baseNotifications.push(
        {
          id: "4",
          type: "promotion",
          title: "Special Offer",
          message: "Get 20% off your next booking! Use code SAVE20 at checkout. Valid until March 31, 2024.",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          isRead: false,
          priority: "low",
          actionUrl: "/trips"
        },
        {
          id: "5",
          type: "rating",
          title: "Rate Your Trip",
          message: "How was your recent trip from Lagos to Abuja? Please rate your experience.",
          timestamp: new Date(Date.now() - 2100000).toISOString(),
          isRead: false,
          priority: "medium",
          actionUrl: "/bookings",
          metadata: {
            bookingId: "ENG-123456",
            route: "Lagos → Abuja"
          }
        }
      );
    }

    return baseNotifications;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem(userType === 'admin' ? 'adminToken' : 'token');
      await fetch(`http://localhost:3003/api/v1/notifications/${notificationId}/read`, {
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
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem(userType === 'admin' ? 'adminToken' : 'token');
      await fetch(`http://localhost:3003/api/v1/notifications/${userType}/${userId}/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Update locally anyway
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "trip":
        return <Bus className="h-4 w-4" />;
      case "promotion":
        return <Gift className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      case "rating":
        return <Star className="h-4 w-4" />;
      case "chat":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
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
      case "rating":
        return "text-yellow-600 bg-yellow-100";
      case "chat":
        return "text-indigo-600 bg-indigo-100";
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

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`relative ${className}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
