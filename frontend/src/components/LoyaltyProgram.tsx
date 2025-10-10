"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Star, 
  Gift, 
  Crown, 
  Zap, 
  Shield, 
  Heart, 
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Diamond,
  Medal,
  Coins,
  CreditCard,
  Bus,
  Route,
  Timer,
  RefreshCw,
  Loader2
} from "lucide-react";

interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  minPoints: number;
  maxPoints?: number;
  color: string;
  benefits: string[];
  icon: React.ComponentType<{ className?: string }>;
  multiplier: number;
}

interface LoyaltyActivity {
  id: string;
  type: "booking" | "referral" | "review" | "bonus" | "redemption";
  description: string;
  points: number;
  date: string;
  status: "earned" | "redeemed" | "pending";
  metadata?: {
    bookingId?: string;
    route?: string;
    amount?: number;
  };
}

interface LoyaltyProgramProps {
  userId: string;
}

export default function LoyaltyProgram({ userId }: LoyaltyProgramProps) {
  const [userLoyalty, setUserLoyalty] = useState({
    currentPoints: 0,
    totalPoints: 0,
    currentTier: "bronze",
    nextTierPoints: 0,
    memberSince: "",
    totalBookings: 0,
    totalSpent: 0,
    streakDays: 0,
    lastActivity: ""
  });
  const [activities, setActivities] = useState<LoyaltyActivity[]>([]);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchLoyaltyData();
  }, [userId]);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user loyalty data
      const loyaltyResponse = await fetch(`https://engracedsmile.com/api/v1/loyalty/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (loyaltyResponse.ok) {
        const loyaltyData = await loyaltyResponse.json();
        setUserLoyalty(loyaltyData);
      } else {
        setUserLoyalty(getMockLoyaltyData());
      }

      // Fetch activities
      const activitiesResponse = await fetch(`https://engracedsmile.com/api/v1/loyalty/${userId}/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);
      } else {
        setActivities(getMockActivities());
      }

      // Fetch tiers
      const tiersResponse = await fetch('https://engracedsmile.com/api/v1/loyalty/tiers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (tiersResponse.ok) {
        const tiersData = await tiersResponse.json();
        setTiers(tiersData);
      } else {
        setTiers(getMockTiers());
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      setUserLoyalty(getMockLoyaltyData());
      setActivities(getMockActivities());
      setTiers(getMockTiers());
    } finally {
      setLoading(false);
    }
  };

  const getMockLoyaltyData = () => ({
    currentPoints: 1250,
    totalPoints: 2500,
    currentTier: "silver",
    nextTierPoints: 750,
    memberSince: "2023-06-15",
    totalBookings: 12,
    totalSpent: 180000,
    streakDays: 5,
    lastActivity: "2024-03-10T10:30:00Z"
  });

  const getMockActivities = (): LoyaltyActivity[] => [
    {
      id: "1",
      type: "booking",
      description: "Completed trip from Lagos to Abuja",
      points: 150,
      date: "2024-03-10T10:30:00Z",
      status: "earned",
      metadata: {
        bookingId: "ENG-123456",
        route: "Lagos → Abuja",
        amount: 15000
      }
    },
    {
      id: "2",
      type: "referral",
      description: "Referred a friend who made their first booking",
      points: 200,
      date: "2024-03-08T14:20:00Z",
      status: "earned"
    },
    {
      id: "3",
      type: "review",
      description: "Left a 5-star review for your recent trip",
      points: 50,
      date: "2024-03-05T16:45:00Z",
      status: "earned"
    },
    {
      id: "4",
      type: "redemption",
      description: "Redeemed 500 points for ₦2,500 discount",
      points: -500,
      date: "2024-03-01T09:15:00Z",
      status: "redeemed"
    },
    {
      id: "5",
      type: "bonus",
      description: "Birthday bonus points",
      points: 100,
      date: "2024-02-28T00:00:00Z",
      status: "earned"
    }
  ];

  const getMockTiers = (): LoyaltyTier[] => [
    {
      id: "bronze",
      name: "Bronze",
      level: 1,
      minPoints: 0,
      maxPoints: 999,
      color: "from-amber-600 to-amber-800",
      benefits: ["Welcome bonus", "Basic support", "Newsletter"],
      icon: Star,
      multiplier: 1.0
    },
    {
      id: "silver",
      name: "Silver",
      level: 2,
      minPoints: 1000,
      maxPoints: 2499,
      color: "from-gray-400 to-gray-600",
      benefits: ["Priority booking", "5% discount", "Free seat selection", "24/7 support"],
      icon: Shield,
      multiplier: 1.2
    },
    {
      id: "gold",
      name: "Gold",
      level: 3,
      minPoints: 2500,
      maxPoints: 4999,
      color: "from-yellow-500 to-yellow-700",
      benefits: ["VIP booking", "10% discount", "Free upgrades", "Dedicated support", "Early access"],
      icon: Crown,
      multiplier: 1.5
    },
    {
      id: "platinum",
      name: "Platinum",
      level: 4,
      minPoints: 5000,
      color: "from-purple-600 to-purple-800",
      benefits: ["Premium booking", "15% discount", "Free meals", "Concierge service", "Exclusive events"],
      icon: Diamond,
      multiplier: 2.0
    }
  ];

  const getCurrentTier = () => {
    return tiers.find(tier => tier.id === userLoyalty.currentTier) || tiers[0];
  };

  const getNextTier = () => {
    const currentTierIndex = tiers.findIndex(tier => tier.id === userLoyalty.currentTier);
    return tiers[currentTierIndex + 1] || null;
  };

  const getProgressPercentage = () => {
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    
    if (!nextTier) return 100;
    
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const userProgress = userLoyalty.currentPoints - currentTier.minPoints;
    
    return Math.min((userProgress / tierRange) * 100, 100);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Bus className="h-4 w-4" />;
      case "referral":
        return <Users className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "bonus":
        return <Gift className="h-4 w-4" />;
      case "redemption":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "booking":
        return "text-blue-600 bg-blue-100";
      case "referral":
        return "text-green-600 bg-green-100";
      case "review":
        return "text-yellow-600 bg-yellow-100";
      case "bonus":
        return "text-purple-600 bg-purple-100";
      case "redemption":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#5d4a15] mx-auto mb-4" />
          <p className="text-gray-600">Loading loyalty program...</p>
        </div>
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h2>
        <p className="text-gray-600">Earn points with every trip and unlock amazing rewards</p>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <currentTier.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentTier.name} Member</h3>
                <p className="text-white/90">Level {currentTier.level} • {userLoyalty.currentPoints} points</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{userLoyalty.currentPoints}</p>
              <p className="text-white/90">Total Points</p>
            </div>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>{userLoyalty.nextTierPoints} points to go</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{userLoyalty.totalBookings}</p>
            <p className="text-sm text-gray-600">Total Trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">₦{userLoyalty.totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{userLoyalty.streakDays}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Math.floor((Date.now() - new Date(userLoyalty.memberSince).getTime()) / (1000 * 60 * 60 * 24))}</p>
            <p className="text-sm text-gray-600">Days as Member</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: "overview", label: "Overview", icon: Target },
            { id: "activities", label: "Activities", icon: Clock },
            { id: "tiers", label: "Tiers", icon: Award },
            { id: "rewards", label: "Rewards", icon: Gift }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#5d4a15] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <currentTier.icon className="h-5 w-5" />
                  Your {currentTier.name} Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Gift className="h-4 w-4 mr-2" />
                  Redeem Points
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Refer Friends
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Leave Review
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "activities" && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your loyalty point activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${activity.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.points > 0 ? '+' : ''}{activity.points}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "tiers" && (
          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <Card key={tier.id} className={`${tier.id === userLoyalty.currentTier ? 'ring-2 ring-[#5d4a15]' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${tier.color} text-white`}>
                        <tier.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{tier.name}</h3>
                        <p className="text-gray-600">Level {tier.level} • {tier.minPoints}+ points</p>
                        {tier.id === userLoyalty.currentTier && (
                          <Badge className="bg-[#5d4a15] text-white">Current Tier</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Benefits</p>
                      <p className="font-medium">{tier.benefits.length} perks</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: "discount",
                title: "Discount Voucher",
                description: "Get 10% off your next booking",
                points: 500,
                icon: DollarSign,
                color: "text-green-600 bg-green-100"
              },
              {
                id: "upgrade",
                title: "Seat Upgrade",
                description: "Free upgrade to premium seats",
                points: 300,
                icon: Crown,
                color: "text-purple-600 bg-purple-100"
              },
              {
                id: "meal",
                title: "Free Meal",
                description: "Complimentary meal on your trip",
                points: 200,
                icon: Gift,
                color: "text-orange-600 bg-orange-100"
              }
            ].map((reward) => {
              const Icon = reward.icon;
              return (
                <Card key={reward.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-full ${reward.color} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold mb-2">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{reward.points} points</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={userLoyalty.currentPoints < reward.points}
                    >
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
