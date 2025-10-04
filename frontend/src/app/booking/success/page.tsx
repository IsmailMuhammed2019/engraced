"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home, Calendar, User, LogIn } from "lucide-react";
import Link from "next/link";

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

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get booking data from URL parameters or session storage
    const getBookingData = () => {
      // Try to get from URL parameters first
      const reference = searchParams.get('reference');
      const amount = searchParams.get('amount');
      const route = searchParams.get('route');
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      const date = searchParams.get('date');
      const time = searchParams.get('time');
      const passengerName = searchParams.get('passengerName');
      const email = searchParams.get('email');
      const phone = searchParams.get('phone');

      if (reference && amount) {
        setBookingData({
          bookingId: reference,
          route: route || `${from} → ${to}`,
          from: from || '',
          to: to || '',
          date: date || new Date().toLocaleDateString(),
          time: time || '',
          amount: `₦${parseInt(amount).toLocaleString()}`,
          passengerName: passengerName || '',
          email: email || '',
          phone: phone || ''
        });
      } else {
        // Fallback to session storage
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Your booking has been successfully confirmed. You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Manage Your Bookings</h4>
            <p className="text-sm text-blue-800 mb-3">
              Create an account or login to track your bookings, view booking history, and manage your travel preferences.
            </p>
            <div className="flex gap-2">
              <Link href="/register" className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <User className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Booking Details</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Booking ID:</strong> {bookingData?.bookingId || 'N/A'}</p>
              <p><strong>Route:</strong> {bookingData?.route || 'N/A'}</p>
              <p><strong>Date:</strong> {bookingData?.date || 'N/A'}</p>
              <p><strong>Time:</strong> {bookingData?.time || 'N/A'}</p>
              <p><strong>Amount:</strong> {bookingData?.amount || '₦0'}</p>
              {bookingData?.passengerName && (
                <p><strong>Passenger:</strong> {bookingData.passengerName}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/bookings')}
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View My Bookings
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Questions about your booking?</p>
            <p className="font-medium">support@engracedsmile.com</p>
            <p>+234 800 123 4567</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4a15] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
