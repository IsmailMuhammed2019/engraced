"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ThumbsUp, 
  MessageCircle,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  Award,
  Crown,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2,
  Eye,
  Flag,
  Trash2,
  Edit,
  Reply,
  Download,
  Share2
} from "lucide-react";

interface Rating {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface RatingStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  recentReviews: number;
}

export default function RatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating" | "helpful">("newest");

  useEffect(() => {
    fetchRatings();
    fetchStats();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://engracedsmile.com/api/v1/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      } else {
        setRatings([]);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://engracedsmile.com/api/v1/reviews/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: [],
          recentReviews: 0
        });
      }
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      setStats({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: [],
        recentReviews: 0
      });
    }
  };


  const filteredRatings = ratings.filter(rating => {
    const userName = `${rating.user.firstName} ${rating.user.lastName}`;
    const matchesSearch = searchTerm === "" ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rating.comment && rating.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = filterRating === "all" || rating.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 bg-green-100";
    if (rating >= 3) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trip":
        return <Calendar className="h-4 w-4" />;
      case "driver":
        return <Users className="h-4 w-4" />;
      case "vehicle":
        return <Shield className="h-4 w-4" />;
      case "route":
        return <TrendingUp className="h-4 w-4" />;
      case "service":
        return <Award className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#5d4a15] mx-auto mb-4" />
            <p className="text-gray-600">Loading ratings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
            <p className="text-gray-600 mt-1">Monitor customer feedback and ratings</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={fetchRatings}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Ratings</p>
                    <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  </div>
                  <Star className="h-8 w-8 text-[#5d4a15]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-green-600">{stats.averageRating.toFixed(1)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">5-Star Ratings</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.ratingDistribution.find(r => r.rating === 5)?.count || 0}
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Ratings</p>
                    <p className="text-2xl font-bold text-red-600">
                      {(stats.ratingDistribution.find(r => r.rating === 1)?.count || 0) + 
                       (stats.ratingDistribution.find(r => r.rating === 2)?.count || 0)}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rating Distribution */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Breakdown of ratings by stars</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.ratingDistribution.map(({ rating, count }) => {
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[#5d4a15] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 w-12 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ratings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
              >
                <option value="all">All Categories</option>
                <option value="trip">Trips</option>
                <option value="driver">Drivers</option>
                <option value="vehicle">Vehicles</option>
                <option value="route">Routes</option>
                <option value="service">Service</option>
              </select>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="rating">Highest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Ratings List */}
        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#5d4a15] rounded-full flex items-center justify-center text-white font-medium">
                    {rating.user.firstName.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{rating.user.firstName} {rating.user.lastName}</h3>
                        <Badge className={getRatingColor(rating.rating)}>
                          {rating.rating} Stars
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {rating.comment && (
                      <p className="text-gray-700 mb-3">{rating.comment}</p>
                    )}
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRatings.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings found</h3>
              <p className="text-gray-500">
                {searchTerm || filterCategory !== "all" || filterRating !== "all"
                  ? "No ratings match your current filters"
                  : "No ratings available yet"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
