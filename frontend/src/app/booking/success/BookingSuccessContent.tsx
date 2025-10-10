"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Download, 
  Home, 
  Calendar, 
  User, 
  LogIn, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  CreditCard,
  Shield,
  Star,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Receipt,
  History,
  Settings
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface BookingData {
  bookingId: string;
  route: string;
  from: string;
  to: string;
  date: string;
  time: string;
  amount: string;
  passengerName: string;
  email: string;
  phone: string;
}

export default function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, login, isLoading: authLoading } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Get booking data from URL parameters and verify payment
    const getBookingData = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');
      
      if (reference || trxref) {
        const paymentRef = reference || trxref;
        
        try {
          // Verify payment with backend
          const response = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reference: paymentRef }),
          });

          const data = await response.json();

          if (data.success) {
            // Payment was successful, get booking details from metadata
            const metadata = data.data.metadata;
            setBookingData({
              bookingId: paymentRef || '',
              route: `${metadata.from || ''} → ${metadata.to || ''}`,
              from: metadata.from || '',
              to: metadata.to || '',
              date: metadata.date || new Date().toLocaleDateString(),
              time: metadata.time || '',
              amount: `₦${(data.data.amount / 100).toLocaleString()}`, // Convert from kobo
              passengerName: metadata.passengerName || '',
              email: data.data.customer.email || '',
              phone: metadata.phone || ''
            });
          } else {
            // Payment verification failed, redirect to failure page
            router.push('/booking/failure');
            return;
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          // On error, redirect to failure page
          router.push('/booking/failure');
          return;
        }
      } else {
        // No reference provided, check session storage
        const storedBooking = sessionStorage.getItem('bookingData');
        if (storedBooking) {
          const parsed = JSON.parse(storedBooking);
          setBookingData({
            bookingId: parsed.bookingId || `ENG-${Date.now()}`,
            route: parsed.route || `${parsed.from} → ${parsed.to}`,
            from: parsed.from || '',
            to: parsed.to || '',
            date: parsed.date || new Date().toLocaleDateString(),
            time: parsed.time || '',
            amount: parsed.amount || '₦0',
            passengerName: parsed.passengerName || '',
            email: parsed.email || '',
            phone: parsed.phone || ''
          });
        } else {
          // Default fallback data
          setBookingData({
            bookingId: `ENG-${Date.now()}`,
            route: 'Lagos → Abuja',
            from: 'Lagos',
            to: 'Abuja',
            date: new Date().toLocaleDateString(),
            time: '06:00 AM',
            amount: '₦0',
            passengerName: '',
            email: '',
            phone: ''
          });
        }
      }
      setIsLoading(false);
    };

    getBookingData();
  }, [searchParams]);

  // Pre-fill registration form with booking data
  useEffect(() => {
    if (bookingData && bookingData.email) {
      const nameParts = bookingData.passengerName ? bookingData.passengerName.split(' ') : ['', ''];
      setRegisterData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: bookingData.email,
        phone: bookingData.phone || '',
      }));
      setLoginData(prev => ({
        ...prev,
        email: bookingData.email,
      }));
    }
  }, [bookingData]);

  // Show success animation on mount
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setShowSuccessAnimation(true), 100);
    }
  }, [isLoading]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!registerData.firstName || !registerData.lastName) {
      setError("First name and last name are required");
      return;
    }
    if (!registerData.email) {
      setError("Email is required");
      return;
    }
    if (!registerData.phone) {
      setError("Phone number is required");
      return;
    }
    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    try {
      await register({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        address: registerData.address,
      });
      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create account. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginData.email || !loginData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      await login(loginData);
      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid email or password");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4a15] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-[#5d4a15]/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showSuccessAnimation ? 1 : 0, scale: showSuccessAnimation ? 1 : 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 border-green-200 shadow-2xl">
            <CardHeader className="text-center pb-2">
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: showSuccessAnimation ? 1 : 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
              >
                <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showSuccessAnimation ? 1 : 0, y: showSuccessAnimation ? 0 : 20 }}
                transition={{ delay: 0.4 }}
              >
                <CardTitle className="text-3xl font-bold text-green-600 mb-2">
                  Payment Successful! 🎉
                </CardTitle>
                <p className="text-gray-600">
                  Your booking has been confirmed. We've sent a confirmation email to{" "}
                  <span className="font-semibold text-[#5d4a15]">{bookingData?.email}</span>
                </p>
              </motion.div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Booking Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showSuccessAnimation ? 1 : 0, y: showSuccessAnimation ? 0 : 20 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#5d4a15]/10 to-[#6b5618]/10 p-6 rounded-xl border border-[#5d4a15]/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                  <Receipt className="h-5 w-5 text-[#5d4a15]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#5d4a15] mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Booking ID</p>
                      <p className="font-semibold text-gray-900">{bookingData?.bookingId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#5d4a15] mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Route</p>
                      <p className="font-semibold text-gray-900">{bookingData?.route}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#5d4a15] mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Travel Date</p>
                      <p className="font-semibold text-gray-900">{bookingData?.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#5d4a15] mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Departure Time</p>
                      <p className="font-semibold text-gray-900">{bookingData?.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-[#5d4a15] mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Passenger</p>
                      <p className="font-semibold text-gray-900">{bookingData?.passengerName || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Amount Paid</p>
                      <p className="font-bold text-green-600 text-lg">{bookingData?.amount}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA to Register/Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showSuccessAnimation ? 1 : 0, y: showSuccessAnimation ? 0 : 20 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                      Unlock Your Travel Dashboard
                    </h4>
                    <p className="text-gray-700 mb-4">
                      Create your free account to access exclusive features and manage your travel seamlessly.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Track all bookings</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Payment history</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Quick rebooking</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => {
                          setModalMode('register');
                          setShowModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] hover:from-[#6b5618] hover:to-[#7a6619] text-white shadow-lg"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Create Free Account
                      </Button>
                      <Button 
                        onClick={() => {
                          setModalMode('login');
                          setShowModal(true);
                        }}
                        variant="outline"
                        className="flex-1 border-2 border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15]/5"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Already Have Account?
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showSuccessAnimation ? 1 : 0, y: showSuccessAnimation ? 0 : 20 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full border-gray-300 hover:border-[#5d4a15] hover:bg-[#5d4a15]/5"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-gray-300 hover:border-green-600 hover:bg-green-50"
                  onClick={() => window.print()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => router.push('/trips')}
                  className="w-full border-gray-300 hover:border-blue-600 hover:bg-blue-50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Another Trip
                </Button>
              </motion.div>

              {/* Support Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showSuccessAnimation ? 1 : 0 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-4 border-t"
              >
                <p className="text-sm text-gray-600 mb-1">Need help with your booking?</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <a href="mailto:support@engracedsmile.com" className="text-[#5d4a15] hover:underline font-medium">
                    support@engracedsmile.com
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href="tel:+2348001234567" className="text-[#5d4a15] hover:underline font-medium">
                    +234 800 123 4567
                  </a>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Registration/Login Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">
                      {modalMode === 'register' ? 'Create Your Account' : 'Welcome Back'}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowModal(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {modalMode === 'register' 
                      ? 'Join thousands of happy travelers' 
                      : 'Sign in to access your dashboard'}
                  </p>
                </CardHeader>
                
                <CardContent>
                  {error && (
                    <Alert className="mb-4 bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="mb-4 bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  {modalMode === 'register' ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={registerData.firstName}
                            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={registerData.lastName}
                            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            placeholder="+234 800 123 4567"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address (Optional)</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            value={registerData.address}
                            onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                            placeholder="123 Main St, Lagos"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            placeholder="Min. 8 characters"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            placeholder="Re-enter password"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={agreeToTerms}
                          onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                          I agree to the{" "}
                          <Link href="/terms" className="text-[#5d4a15] hover:underline" target="_blank">
                            Terms & Conditions
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-[#5d4a15] hover:underline" target="_blank">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#5d4a15] to-[#6b5618] hover:from-[#6b5618] hover:to-[#7a6619]"
                        disabled={authLoading}
                      >
                        {authLoading ? "Creating Account..." : "Create Account"}
                      </Button>

                      <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setModalMode('login')}
                          className="text-[#5d4a15] hover:underline font-semibold"
                        >
                          Sign In
                        </button>
                      </p>
                    </form>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="loginEmail">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="loginEmail"
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="loginPassword">Password</Label>
                        <div className="relative">
                          <Input
                            id="loginPassword"
                            type={showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#5d4a15] to-[#6b5618] hover:from-[#6b5618] hover:to-[#7a6619]"
                        disabled={authLoading}
                      >
                        {authLoading ? "Signing In..." : "Sign In"}
                      </Button>

                      <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setModalMode('register')}
                          className="text-[#5d4a15] hover:underline font-semibold"
                        >
                          Create Account
                        </button>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

