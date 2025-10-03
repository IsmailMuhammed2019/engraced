"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home, Calendar } from "lucide-react";

export default function BookingSuccess() {
  const router = useRouter();

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
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Booking Details</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Booking ID:</strong> ENG-123456</p>
              <p><strong>Route:</strong> Lagos → Abuja</p>
              <p><strong>Date:</strong> January 15, 2024</p>
              <p><strong>Time:</strong> 06:00 AM</p>
              <p><strong>Amount:</strong> ₦7,500</p>
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
