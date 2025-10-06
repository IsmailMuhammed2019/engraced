"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertModal } from "@/components/ui/modal";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
    
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isClient) return; // Don't run on server side
    
    try {
        // Try real admin authentication
        const response = await fetch('/api/v1/simple-admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the real JWT token
        localStorage.setItem('adminToken', data.data.accessToken);
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        setIsLoggedIn(true);
        showAlert('Success', 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
        return;
      } else {
        const errorData = await response.json();
        console.error('Admin login failed:', errorData);
        showAlert('Login Failed', errorData.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Connection Error', 'Login failed. Please check your connection and try again.', 'error');
    }
  };

  if (isLoggedIn) {
    // Redirect to admin dashboard
    window.location.href = "/admin";
    return null;
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg border-2 border-[#5d4a15]">
            <img 
              src="/logo.png" 
              alt="Engracedsmile Logo" 
              className="w-20 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Engracedsmile</h1>
          <p className="text-gray-600">Admin Portal</p>
          <p className="text-sm text-gray-500 mt-1">Travel and Logistics Management</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@engracedsmile.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-gray-300 focus:border-[#5d4a15] focus:ring-[#5d4a15]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-[#5d4a15] focus:ring-[#5d4a15] pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] hover:from-[#6b5618] hover:to-[#5d4a15] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Admin Features</h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#5d4a15] rounded-full mr-2"></div>
                  Route Management
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#5d4a15] rounded-full mr-2"></div>
                  Trip Scheduling
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#5d4a15] rounded-full mr-2"></div>
                  Driver Management
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#5d4a15] rounded-full mr-2"></div>
                  Vehicle Tracking
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#5d4a15] rounded-full mr-2"></div>
                  Booking Analytics
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#5d4a15] rounded-full mr-2"></div>
                  Payment Reports
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>© 2024 Engracedsmile. All rights reserved.</p>
          <p className="mt-1">Secure Admin Portal</p>
        </div>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({...alertModal, isOpen: false})}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </div>
  );
  }

