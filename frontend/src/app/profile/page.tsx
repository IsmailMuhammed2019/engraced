"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Bell,
  CreditCard,
  Award,
  Star,
  Gift,
  Settings,
  Edit,
  Save,
  Camera,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Key,
  Smartphone,
  Globe,
  Heart,
  MessageCircle,
  HelpCircle,
  LogOut,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  profileImage?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: boolean;
    smsUpdates: boolean;
    emailUpdates: boolean;
    marketingEmails: boolean;
    seatPreference: string;
    mealPreference: string;
    language: string;
  };
  loyaltyInfo: {
    points: number;
    tier: string;
    nextTierPoints: number;
    totalTrips: number;
    memberSince: string;
  };
  paymentMethods: {
    id: string;
    type: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
  }[];
  documents: {
    id: string;
    type: string;
    name: string;
    uploadDate: string;
    status: string;
  }[];
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://engracedsmile.com/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          emergencyContactName: data.emergencyContact?.name || "",
          emergencyContactPhone: data.emergencyContact?.phone || "",
          emergencyContactRelationship: data.emergencyContact?.relationship || ""
        });
      } else {
        // Fallback to mock data
        setProfile(getMockProfile());
        setFormData({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: "",
          dateOfBirth: "",
          gender: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelationship: ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(getMockProfile());
    } finally {
      setLoading(false);
    }
  };

  const getMockProfile = (): UserProfile => ({
    id: "1",
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "+2348071116229",
    address: "123 Main Street, Lagos, Nigeria",
    dateOfBirth: "1990-01-15",
    gender: "Male",
    profileImage: "/api/placeholder/150/150",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+2348071116230",
      relationship: "Spouse"
    },
    preferences: {
      notifications: true,
      smsUpdates: true,
      emailUpdates: true,
      marketingEmails: false,
      seatPreference: "Window",
      mealPreference: "Vegetarian",
      language: "English"
    },
    loyaltyInfo: {
      points: 1250,
      tier: "Gold",
      nextTierPoints: 250,
      totalTrips: 45,
      memberSince: "2023-01-15"
    },
    paymentMethods: [
      {
        id: "1",
        type: "card",
        last4: "4242",
        expiry: "12/25",
        isDefault: true
      },
      {
        id: "2",
        type: "bank",
        last4: "1234",
        expiry: "",
        isDefault: false
      }
    ],
    documents: [
      {
        id: "1",
        type: "ID",
        name: "National ID Card",
        uploadDate: "2024-01-15",
        status: "verified"
      },
      {
        id: "2",
        type: "Passport",
        name: "International Passport",
        uploadDate: "2024-01-10",
        status: "pending"
      }
    ]
  });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://engracedsmile.com/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setEditing(false);
        fetchProfile(); // Refresh profile data
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
              </div>
              <div className="flex gap-3">
                {editing ? (
                  <>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#5d4a15] hover:bg-[#6b5618]" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </div>
                  {editing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-gray-600">{profile?.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-[#5d4a15] text-white">
                      <Award className="h-3 w-3 mr-1" />
                      {profile?.loyaltyInfo.tier} Member
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {profile?.loyaltyInfo.points} points
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="font-medium">{profile?.loyaltyInfo.memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Loyalty
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      disabled={!editing}
                      placeholder="Enter your full address"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>Provide emergency contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                      <Input
                        id="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                      <Input
                        id="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => handleInputChange("emergencyContactRelationship", e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications about your trips</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile?.preferences.notifications}
                      className="h-4 w-4 text-[#5d4a15] focus:ring-[#5d4a15] border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Email Updates</p>
                        <p className="text-sm text-gray-500">Receive trip updates via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile?.preferences.emailUpdates}
                      className="h-4 w-4 text-[#5d4a15] focus:ring-[#5d4a15] border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">SMS Updates</p>
                        <p className="text-sm text-gray-500">Receive updates via SMS</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile?.preferences.smsUpdates}
                      className="h-4 w-4 text-[#5d4a15] focus:ring-[#5d4a15] border-gray-300 rounded"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                  <CardDescription>Set your travel preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="seatPreference">Seat Preference</Label>
                      <select
                        id="seatPreference"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
                      >
                        <option value="Window">Window</option>
                        <option value="Aisle">Aisle</option>
                        <option value="No Preference">No Preference</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mealPreference">Meal Preference</Label>
                      <select
                        id="mealPreference"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="No Preference">No Preference</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {method.type === "card" ? "Card" : "Bank Account"} ending in {method.last4}
                            </p>
                            {method.expiry && <p className="text-sm text-gray-500">Expires {method.expiry}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <Badge className="bg-green-100 text-green-800">Default</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loyalty Program</CardTitle>
                  <CardDescription>Your loyalty status and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white rounded-lg">
                      <Award className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{profile?.loyaltyInfo.points}</p>
                      <p className="text-sm opacity-90">Loyalty Points</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <Star className="h-8 w-8 mx-auto mb-2 text-[#5d4a15]" />
                      <p className="text-2xl font-bold text-[#5d4a15]">{profile?.loyaltyInfo.tier}</p>
                      <p className="text-sm text-gray-600">Current Tier</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <Gift className="h-8 w-8 mx-auto mb-2 text-[#5d4a15]" />
                      <p className="text-2xl font-bold text-[#5d4a15]">{profile?.loyaltyInfo.nextTierPoints}</p>
                      <p className="text-sm text-gray-600">Points to Next Tier</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Rewards</CardTitle>
                  <CardDescription>Redeem your loyalty points for rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Free Trip</h3>
                        <Badge className="bg-[#5d4a15] text-white">1000 pts</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Get a free trip on any route</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Redeem
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Discount Voucher</h3>
                        <Badge className="bg-[#5d4a15] text-white">500 pts</Badge>
                      </div>
                      <p className="text-sm text-gray-600">20% off your next booking</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Redeem
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
