"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Home } from "lucide-react";

export default function BookingFailure() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            We&apos;re sorry, but your payment could not be processed at this time. 
            Please try again or contact our support team for assistance.
          </p>
          
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
              onClick={() => router.back()}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact us at:</p>
            <p className="font-medium">support@engracedsmile.com</p>
            <p>+234 800 123 4567</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
