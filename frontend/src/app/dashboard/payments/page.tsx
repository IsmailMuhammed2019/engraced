"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerDashboardLayout from "@/components/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  amount: number;
  paymentStatus: string;
  paymentDate: string;
  paystackRef: string;
  createdAt: string;
  booking: {
    bookingNumber: string;
    route: { from: string; to: string; };
    trip: { departureTime: string; };
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://engracedsmile.com/api/v1/payments/my-payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setPayments(await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "FAILED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalPaid = payments.filter(p => p.paymentStatus === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <ProtectedRoute>
      <CustomerDashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
            <p className="text-gray-600">View all your transactions and receipts</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">₦{totalPaid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Successful Payments</p>
                <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.paymentStatus === 'PAID').length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Payments List */}
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto"></div>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No payments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          payment.paymentStatus === 'PAID' ? 'bg-green-100' : 
                          payment.paymentStatus === 'PENDING' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {payment.paymentStatus === 'PAID' ? <CheckCircle className="h-6 w-6 text-green-600" /> :
                           payment.paymentStatus === 'PENDING' ? <Clock className="h-6 w-6 text-yellow-600" /> :
                           <AlertCircle className="h-6 w-6 text-red-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            ₦{Number(payment.amount).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {payment.booking?.route?.from} → {payment.booking?.route?.to}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : new Date(payment.createdAt).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">Ref: {payment.paystackRef}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(payment.paymentStatus)}>
                          {payment.paymentStatus}
                        </Badge>
                        {payment.paymentStatus === 'PAID' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}

