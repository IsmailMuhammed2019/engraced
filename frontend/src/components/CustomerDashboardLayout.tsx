"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  MessageCircle,
  Award,
  History,
  Receipt,
  ChevronRight,
  Home,
  Package
} from "lucide-react";

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const sidebarLinks: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Payment History",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Trip History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "My Receipts",
    href: "/dashboard/receipts",
    icon: Receipt,
  },
  {
    title: "Loyalty & Rewards",
    href: "/dashboard/loyalty",
    icon: Award,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface CustomerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function CustomerDashboardLayout({ children }: CustomerDashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="border-b p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Engraced Smile</h2>
            <p className="text-xs text-gray-500">Customer Portal</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-[#5d4a15]/10",
                  isActive
                    ? "bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white hover:from-[#6b5618] hover:to-[#7a6619]"
                    : "text-gray-700 hover:text-[#5d4a15]"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span>{link.title}</span>
                </div>
                {link.badge && (
                  <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    {link.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Actions
          </p>
          <Link
            href="/trips"
            className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-[#5d4a15]/10 hover:text-[#5d4a15]"
            onClick={() => setMobileOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Book New Trip</span>
          </Link>
          <Link
            href="/logistics"
            className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-[#5d4a15]/10 hover:text-[#5d4a15]"
            onClick={() => setMobileOpen(false)}
          >
            <Package className="h-5 w-5" />
            <span>Send Package</span>
          </Link>
        </div>
      </ScrollArea>

      {/* Logout Button */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
            </Sheet>

            {/* Search Bar */}
            <div className="flex flex-1 items-center space-x-4 lg:ml-4">
              <div className="hidden w-full max-w-md lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings, receipts..."
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#5d4a15] focus:outline-none focus:ring-2 focus:ring-[#5d4a15]/20"
                  />
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

