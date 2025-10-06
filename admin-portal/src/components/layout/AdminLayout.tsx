"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Route, 
  Calendar, 
  Users, 
  Car, 
  BookOpen, 
  CreditCard,
  Gift,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  MessageCircle,
  Star
} from "lucide-react";
import AdminNotificationCenter from "../AdminNotificationCenter";
import AdminSupportChat from "../AdminSupportChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Routes", href: "/admin/routes", icon: Route },
  { name: "Trips", href: "/admin/trips", icon: Calendar },
  { name: "Drivers", href: "/admin/drivers", icon: Users },
  { name: "Vehicles", href: "/admin/vehicles", icon: Car },
  { name: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Ratings", href: "/admin/ratings", icon: Star },
  { name: "Promotions", href: "/admin/promotions", icon: Gift },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl slide-in">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Engracedsmile Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="ml-2 font-semibold text-gray-900">Engracedsmile</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : 'text-gray-700'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b">
            <img 
              src="/logo.png" 
              alt="Engracedsmile Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="ml-2 font-semibold text-gray-900">Engracedsmile</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : 'text-gray-700'}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.name || "Dashboard"}
                </h1>
                <p className="text-sm text-gray-500">
                  {pathname === "/admin" && "Overview of your travel and logistics operations"}
                  {pathname === "/admin/routes" && "Manage your travel routes and pricing"}
                  {pathname === "/admin/trips" && "Schedule and manage trips"}
                  {pathname === "/admin/drivers" && "Manage your drivers and their information"}
                  {pathname === "/admin/vehicles" && "Manage your fleet of vehicles"}
                  {pathname === "/admin/bookings" && "Manage customer bookings and reservations"}
                  {pathname === "/admin/payments" && "Track payments and transactions"}
                  {pathname === "/admin/promotions" && "Manage promotions and offers"}
                  {pathname === "/admin/settings" && "System settings and configuration"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              
              {/* Support Chat */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsChatOpen(true)}
                className="text-gray-600 hover:text-[#5d4a15]"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              
              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#5d4a15] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@engracedsmile.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Admin Notification Center */}
      <AdminNotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        adminId="admin-user"
      />

      {/* Admin Support Chat */}
      <AdminSupportChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        adminId="admin-user"
      />
    </div>
  );
}