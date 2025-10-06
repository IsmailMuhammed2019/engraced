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
  userName: string;
  userAvatar?: string;
  rating: number;
  review: string;
  category: "trip" | "route" | "driver" | "vehicle" | "service";
  targetId: string;
  targetName: string;
  targetType: string;
  timestamp: string;
  helpful: number;
  verified: boolean;
  images?: string[];
  tags?: string[];
  response?: {
    text: string;
    author: string;
    timestamp: string;
  };
}

interface RatingStats {
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    star: number;
    count: number;
    percentage: number;
  }[];
  categoryStats: {
    category: string;
    count: number;
    average: number;
  }[];
  recentRatings: Rating[];
  topRated: {
    id: string;
    name: string;
    type: string;
    averageRating: number;
    totalRatings: number;
  }[];
  lowRated: {
    id: string;
    name: string;
    type: string;
    averageRating: number;
    totalRatings: number;
  }[];
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
      const response = await fetch('http://localhost:3003/api/v1/admin/ratings', {
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
      const response = await fetch('http://localhost:3003/api/v1/admin/ratings/stats', {
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
          totalRatings: 0,
          averageRating: 0,
          ratingDistribution: [],
          categoryStats: [],
          recentRatings: [],
          topRated: [],
          lowRated: []
        });
      }
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      setStats({
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: [],
        categoryStats: [],
        recentRatings: [],
        topRated: [],
        lowRated: []
      });
    }
  };


  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = searchTerm === "" ||
      rating.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.targetName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || rating.category === filterCategory;
    const matchesRating = filterRating === "all" || rating.rating === parseInt(filterRating);
    
    return matchesSearch && matchesCategory && matchesRating;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case "oldest":
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case "rating":
        return b.rating - a.rating;
      case "helpful":
        return b.helpful - a.helpful;
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
                    <p className="text-2xl font-bold">{stats.totalRatings}</p>
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
                    <p className="text-2xl font-bold text-yellow-600">{stats.ratingDistribution[0].count}</p>
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
                      {stats.ratingDistribution[3].count + stats.ratingDistribution[4].count}
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
                {stats.ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{star}</span>
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
                ))}
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
                    {rating.userName.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{rating.userName}</h3>
                        <Badge className={getRatingColor(rating.rating)}>
                          {rating.rating} Stars
                        </Badge>
                        {rating.verified && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(rating.timestamp).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {getCategoryIcon(rating.category)}
                      <span className="text-sm text-gray-600">
                        {rating.category.charAt(0).toUpperCase() + rating.category.slice(1)}: {rating.targetName}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{rating.review}</p>
                    
                    {rating.tags && rating.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {rating.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{rating.helpful} helpful</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>Reply</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                        <Button variant="outline" size="sm">
                          <Flag className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                      </div>
                    </div>
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
