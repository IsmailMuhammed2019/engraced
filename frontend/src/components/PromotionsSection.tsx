"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Percent, 
  Calendar, 
  Clock, 
  Star, 
  ArrowRight,
  Tag,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: "discount" | "fixed" | "percentage" | "freebie";
  value: string;
  code?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableRoutes: string[];
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  image?: string;
  terms: string[];
}

interface Offer {
  id: string;
  title: string;
  description: string;
  type: "early_bird" | "group_booking" | "loyalty" | "seasonal";
  discount: number;
  validUntil: string;
  conditions: string[];
  isActive: boolean;
}

export default function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("promotions");

  useEffect(() => {
    fetchPromotions();
    fetchOffers();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:3003/api/v1/promotions/active');
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      } else {
        // Fallback to mock data
        setPromotions(getMockPromotions());
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setPromotions(getMockPromotions());
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:3003/api/v1/offers/active');
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      } else {
        // Fallback to mock data
        setOffers(getMockOffers());
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers(getMockOffers());
    }
  };

  const getMockPromotions = (): Promotion[] => [
    {
      id: "PROMO-001",
      title: "Early Bird Special",
      description: "Get 15% off on bookings made 7 days in advance",
      type: "percentage",
      value: "15%",
      code: "EARLY15",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      isActive: true,
      applicableRoutes: ["Lagos-Abuja", "Abuja-Kaduna", "Lagos-Port Harcourt"],
      minAmount: 5000,
      maxDiscount: 2000,
      usageLimit: 100,
      usedCount: 45,
      terms: [
        "Valid for bookings made 7+ days in advance",
        "Minimum booking amount: ₦5,000",
        "Maximum discount: ₦2,000",
        "Cannot be combined with other offers"
      ]
    },
    {
      id: "PROMO-002",
      title: "Weekend Warrior",
      description: "Fixed discount of ₦1,000 for weekend travels",
      type: "fixed",
      value: "₦1,000",
      code: "WEEKEND1000",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      isActive: true,
      applicableRoutes: ["All Routes"],
      minAmount: 3000,
      usageLimit: 50,
      usedCount: 23,
      terms: [
        "Valid for weekend bookings only",
        "Minimum booking amount: ₦3,000",
        "One use per customer"
      ]
    },
    {
      id: "PROMO-003",
      title: "New User Welcome",
      description: "Welcome discount for new users",
      type: "percentage",
      value: "20%",
      code: "WELCOME20",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      applicableRoutes: ["All Routes"],
      minAmount: 2000,
      maxDiscount: 5000,
      usageLimit: 1,
      usedCount: 0,
      terms: [
        "New users only",
        "First booking only",
        "Maximum discount: ₦5,000"
      ]
    }
  ];

  const getMockOffers = (): Offer[] => [
    {
      id: "OFFER-001",
      title: "Group Booking Discount",
      description: "Special rates for group bookings of 5+ people",
      type: "group_booking",
      discount: 20,
      validUntil: "2024-12-31",
      conditions: [
        "Minimum 5 passengers",
        "Same route and date",
        "Advance booking required"
      ],
      isActive: true
    },
    {
      id: "OFFER-002",
      title: "Loyalty Member Benefits",
      description: "Exclusive benefits for our loyal customers",
      type: "loyalty",
      discount: 10,
      validUntil: "2024-12-31",
      conditions: [
        "Gold tier members only",
        "Minimum 10 completed trips",
        "Valid on all routes"
      ],
      isActive: true
    },
    {
      id: "OFFER-003",
      title: "Holiday Season Special",
      description: "Special rates during holiday seasons",
      type: "seasonal",
      discount: 25,
      validUntil: "2024-12-25",
      conditions: [
        "Holiday season only",
        "Limited seats available",
        "Advance booking required"
      ],
      isActive: true
    }
  ];

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-5 w-5" />;
      case "fixed":
        return <Tag className="h-5 w-5" />;
      case "freebie":
        return <Gift className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "early_bird":
        return <Clock className="h-5 w-5" />;
      case "group_booking":
        return <Users className="h-5 w-5" />;
      case "loyalty":
        return <Star className="h-5 w-5" />;
      case "seasonal":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getPromotionColor = (type: string) => {
    switch (type) {
      case "percentage":
        return "bg-green-100 text-green-800 border-green-200";
      case "fixed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "freebie":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Special Promotions & Offers
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Take advantage of our exclusive deals and save on your next journey
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("promotions")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "promotions"
                  ? "bg-[#5d4a15] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Gift className="h-4 w-4 mr-2 inline" />
              Promotions
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "offers"
                  ? "bg-[#5d4a15] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Award className="h-4 w-4 mr-2 inline" />
              Special Offers
            </button>
          </div>
        </div>

        {/* Promotions Tab */}
        {activeTab === "promotions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#5d4a15]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPromotionIcon(promotion.type)}
                      <CardTitle className="text-lg">{promotion.title}</CardTitle>
                    </div>
                    <Badge className={getPromotionColor(promotion.type)}>
                      {promotion.value}
                    </Badge>
                  </div>
                  <CardDescription>{promotion.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {promotion.code && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Code: {promotion.code}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPromoCode(promotion.code!)}
                      >
                        Copy
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="font-medium">{promotion.endDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Usage:</span>
                      <span className="font-medium">
                        {promotion.usedCount}/{promotion.usageLimit || "∞"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Terms & Conditions:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {promotion.terms.map((term, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-[#5d4a15] hover:bg-[#6b5618]">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Use Promotion
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {getOfferIcon(offer.type)}
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                  </div>
                  <CardDescription>{offer.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#5d4a15]">
                      {offer.discount}% OFF
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="font-medium">{offer.validUntil}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Conditions:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {offer.conditions.map((condition, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-3 w-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-[#5d4a15] hover:bg-[#6b5618]">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Don&apos;t Miss Out on Great Deals!
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Subscribe to our newsletter and be the first to know about new promotions and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                />
                <Button className="bg-white text-[#5d4a15] hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
