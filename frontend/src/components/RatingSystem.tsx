"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingService from "@/services/RatingService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Bus,
  Route,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Wifi,
  Coffee,
  Battery,
  Navigation,
  Timer,
  Award,
  Crown,
  Zap,
  Gift,
  MessageCircle,
  Camera,
  Upload,
  X,
  Send,
  Edit,
  Trash2,
  Flag,
  Share2,
  Bookmark,
  RefreshCw,
  Loader2
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

interface RatingSystemProps {
  targetId: string;
  targetType: "trip" | "route" | "driver" | "vehicle";
  targetName: string;
  onRatingSubmit?: (rating: Omit<Rating, 'id' | 'timestamp' | 'helpful' | 'verified'>) => void;
  showForm?: boolean;
  showReviews?: boolean;
  maxRating?: number;
}

export default function RatingSystem({ 
  targetId, 
  targetType, 
  targetName, 
  onRatingSubmit,
  showForm = true,
  showReviews = true,
  maxRating = 5
}: RatingSystemProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "helpful" | "rating">("newest");

  const ratingTags = {
    trip: ["comfortable", "on-time", "clean", "friendly-staff", "good-value", "smooth-ride"],
    route: ["scenic", "convenient", "safe", "well-maintained", "fast", "reliable"],
    driver: ["professional", "friendly", "safe", "punctual", "helpful", "experienced"],
    vehicle: ["clean", "comfortable", "modern", "well-maintained", "spacious", "reliable"]
  };

  const ratingEmojis = {
    5: { icon: Heart, color: "text-red-500", label: "Excellent" },
    4: { icon: Smile, color: "text-green-500", label: "Good" },
    3: { icon: Meh, color: "text-yellow-500", label: "Average" },
    2: { icon: Frown, color: "text-orange-500", label: "Poor" },
    1: { icon: Frown, color: "text-red-500", label: "Terrible" }
  };

  useEffect(() => {
    fetchRatings();
    
    // Subscribe to real-time updates
    const handleRatingUpdate = (data: { type: string; rating: Rating }) => {
      if (data.type === 'new_rating') {
        setRatings(prev => [data.rating, ...prev]);
      }
    };
    
    RatingService.getInstance().subscribe(targetId, targetType, handleRatingUpdate);
    
    return () => {
      RatingService.getInstance().unsubscribe(targetId, targetType, handleRatingUpdate);
    };
  }, [targetId, targetType]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const ratings = await RatingService.getInstance().getRatings(targetId, targetType);
      setRatings(ratings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings(getMockRatings());
    } finally {
      setLoading(false);
    }
  };

  const getMockRatings = (): Rating[] => [
    {
      id: "1",
      userId: "USER-001",
      userName: "John Doe",
      userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5,
      review: "Excellent service! The driver was very professional and the vehicle was clean and comfortable. Highly recommended!",
      category: targetType,
      targetId,
      targetName,
      targetType,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      helpful: 12,
      verified: true,
      images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=60"],
      tags: ["comfortable", "professional", "clean"]
    },
    {
      id: "2",
      userId: "USER-002",
      userName: "Jane Smith",
      userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4,
      review: "Good experience overall. The trip was smooth and on time. The driver was friendly and helpful.",
      category: targetType,
      targetId,
      targetName,
      targetType,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      helpful: 8,
      verified: true,
      tags: ["on-time", "friendly"]
    },
    {
      id: "3",
      userId: "USER-003",
      userName: "Mike Johnson",
      userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 3,
      review: "Average service. The vehicle was okay but could be cleaner. The driver was professional but not very talkative.",
      category: targetType,
      targetId,
      targetName,
      targetType,
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      helpful: 3,
      verified: false,
      tags: ["average"]
    }
  ];

  const handleRatingSubmit = async () => {
    if (userRating === 0) return;

    setSubmitting(true);
    try {
      const ratingData = {
        userId: "current-user", // This would come from auth context
        userName: "Current User",
        rating: userRating,
        review: userReview,
        category: targetType,
        targetId,
        targetName,
        targetType,
        tags: selectedTags,
        images: images.map(img => URL.createObjectURL(img))
      };

      const newRating = await RatingService.getInstance().submitRating(ratingData);
      setRatings(prev => [newRating, ...prev]);
      setUserRating(0);
      setUserReview("");
      setSelectedTags([]);
      setImages([]);
      setShowRatingForm(false);
      
      if (onRatingSubmit) {
        onRatingSubmit(ratingData);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files.slice(0, 3 - prev.length)]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const markHelpful = async (ratingId: string) => {
    try {
      await fetch(`https://engracedsmile.com/api/v1/ratings/${ratingId}/helpful`, {
        method: 'POST'
      });
      
      setRatings(prev => 
        prev.map(rating => 
          rating.id === ratingId 
            ? { ...rating, helpful: rating.helpful + 1 }
            : rating
        )
      );
    } catch (error) {
      console.error('Error marking as helpful:', error);
    }
  };

  const filteredRatings = ratings.filter(rating => {
    if (filter === "all") return true;
    return rating.rating === parseInt(filter);
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case "oldest":
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case "helpful":
        return b.helpful - a.helpful;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratings.filter(r => r.rating === star).length,
    percentage: ratings.length > 0 
      ? (ratings.filter(r => r.rating === star).length / ratings.length) * 100 
      : 0
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#5d4a15]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#5d4a15]" />
            Ratings & Reviews
          </CardTitle>
          <CardDescription>What people say about {targetName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-[#5d4a15] mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">
                Based on {ratings.length} review{ratings.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-8">{star}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#5d4a15] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Experience</CardTitle>
            <CardDescription>Share your experience with {targetName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showRatingForm ? (
              <Button 
                onClick={() => setShowRatingForm(true)}
                className="w-full bg-[#5d4a15] hover:bg-[#6b5618]"
              >
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            ) : (
              <div className="space-y-4">
                {/* Star Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const EmojiIcon = ratingEmojis[star as keyof typeof ratingEmojis].icon;
                      return (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          className={`p-2 rounded-lg transition-all ${
                            star <= userRating 
                              ? 'bg-yellow-100 scale-110' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <EmojiIcon className={`h-6 w-6 ${
                            star <= userRating 
                              ? ratingEmojis[star as keyof typeof ratingEmojis].color
                              : 'text-gray-400'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {ratingEmojis[userRating as keyof typeof ratingEmojis].label}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">What was good? (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {ratingTags[targetType].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-[#5d4a15] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review *</label>
                  <Textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Share your experience..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Photos (Optional)</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="rating-images"
                    />
                    <label 
                      htmlFor="rating-images"
                      className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#5d4a15] transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">Add photos</span>
                    </label>
                    
                    {images.length > 0 && (
                      <div className="flex gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={URL.createObjectURL(image)} 
                              alt={`Upload ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleRatingSubmit}
                    disabled={userRating === 0 || submitting}
                    className="flex-1 bg-[#5d4a15] hover:bg-[#6b5618]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRatingForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {showReviews && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reviews</CardTitle>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "all" | "5" | "4" | "3" | "2" | "1")}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
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
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "helpful" | "rating")}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRatings.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Be the first to review {targetName}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRatings.map((rating) => (
                  <div key={rating.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#5d4a15] rounded-full flex items-center justify-center text-white font-medium">
                        {rating.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{rating.userName}</span>
                          {rating.verified && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= rating.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{rating.review}</p>
                        
                        {rating.tags && rating.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {rating.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {rating.images && rating.images.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {rating.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(rating.timestamp).toLocaleDateString()}</span>
                          <button
                            onClick={() => markHelpful(rating.id)}
                            className="flex items-center gap-1 hover:text-[#5d4a15]"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            Helpful ({rating.helpful})
                          </button>
                          <button className="flex items-center gap-1 hover:text-[#5d4a15]">
                            <MessageCircle className="h-3 w-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
