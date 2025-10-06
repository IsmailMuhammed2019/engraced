"use client";

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
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    star: number;
    count: number;
    percentage: number;
  }[];
  recentRatings: Rating[];
}

class RatingService {
  private static instance: RatingService;
  private listeners: Map<string, ((data: { type: string; rating: Rating }) => void)[]> = new Map();
  private cache: Map<string, Rating[] | RatingStats> = new Map();

  static getInstance(): RatingService {
    if (!RatingService.instance) {
      RatingService.instance = new RatingService();
    }
    return RatingService.instance;
  }

  // Subscribe to rating updates for a specific target
  subscribe(targetId: string, targetType: string, callback: (data: { type: string; rating: Rating }) => void) {
    const key = `${targetType}-${targetId}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);
  }

  // Unsubscribe from rating updates
  unsubscribe(targetId: string, targetType: string, callback: (data: { type: string; rating: Rating }) => void) {
    const key = `${targetType}-${targetId}`;
    const listeners = this.listeners.get(key);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Notify all listeners of rating updates
  private notify(targetId: string, targetType: string, data: { type: string; rating: Rating }) {
    const key = `${targetType}-${targetId}`;
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Submit a new rating
  async submitRating(ratingData: Omit<Rating, 'id' | 'timestamp' | 'helpful' | 'verified'>): Promise<Rating> {
    try {
      const response = await fetch('http://localhost:3003/api/v1/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ratingData)
      });

      if (response.ok) {
        const newRating = await response.json();
        
        // Notify all listeners
        this.notify(ratingData.targetId, ratingData.category, {
          type: 'new_rating',
          rating: newRating
        });

        // Update cache
        this.updateCache(ratingData.targetId, ratingData.category, newRating);

        return newRating;
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }

  // Get ratings for a specific target
  async getRatings(targetId: string, targetType: string): Promise<Rating[]> {
    const cacheKey = `ratings-${targetType}-${targetId}`;
    
    try {
      const response = await fetch(`http://localhost:3003/api/v1/ratings/${targetType}/${targetId}`);
      
      if (response.ok) {
        const ratings = await response.json();
        this.cache.set(cacheKey, ratings);
        return ratings;
      } else {
        // Return cached data if available
        const cached = this.cache.get(cacheKey);
        return (cached && Array.isArray(cached)) ? cached : [];
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      const cached = this.cache.get(cacheKey);
      return (cached && Array.isArray(cached)) ? cached : [];
    }
  }

  // Get rating statistics
  async getRatingStats(targetId: string, targetType: string): Promise<RatingStats> {
    const cacheKey = `stats-${targetType}-${targetId}`;
    
    try {
      const response = await fetch(`http://localhost:3003/api/v1/ratings/${targetType}/${targetId}/stats`);
      
      if (response.ok) {
        const stats = await response.json();
        this.cache.set(cacheKey, stats);
        return stats;
      } else {
        // Return cached data if available
        const cached = this.cache.get(cacheKey);
        return (cached && !Array.isArray(cached)) ? cached : this.getDefaultStats();
      }
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      const cached = this.cache.get(cacheKey);
      return (cached && !Array.isArray(cached)) ? cached : this.getDefaultStats();
    }
  }

  // Mark rating as helpful
  async markHelpful(ratingId: string): Promise<void> {
    try {
      await fetch(`http://localhost:3003/api/v1/ratings/${ratingId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error marking rating as helpful:', error);
    }
  }

  // Update cache when new rating is added
  private updateCache(targetId: string, targetType: string, newRating: Rating) {
    const ratingsKey = `ratings-${targetType}-${targetId}`;
    const statsKey = `stats-${targetType}-${targetId}`;
    
    // Update ratings cache
    const existingRatings = this.cache.get(ratingsKey) || [];
    this.cache.set(ratingsKey, [newRating, ...(Array.isArray(existingRatings) ? existingRatings : [])]);
    
    // Update stats cache
    const existingStats = this.cache.get(statsKey);
    if (existingStats) {
      const updatedStats = this.calculateStats([newRating, ...(Array.isArray(existingRatings) ? existingRatings : [])]);
      this.cache.set(statsKey, updatedStats);
    }
  }

  // Calculate rating statistics
  private calculateStats(ratings: Rating[]): RatingStats {
    if (ratings.length === 0) {
      return this.getDefaultStats();
    }

    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
    const totalRatings = ratings.length;
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const count = ratings.filter(r => r.rating === star).length;
      return {
        star,
        count,
        percentage: (count / totalRatings) * 100
      };
    });

    const recentRatings = ratings
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      averageRating,
      totalRatings,
      ratingDistribution,
      recentRatings
    };
  }

  // Get default stats when no data is available
  private getDefaultStats(): RatingStats {
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: [5, 4, 3, 2, 1].map(star => ({
        star,
        count: 0,
        percentage: 0
      })),
      recentRatings: []
    };
  }

  // Clear cache for a specific target
  clearCache(targetId: string, targetType: string) {
    const ratingsKey = `ratings-${targetType}-${targetId}`;
    const statsKey = `stats-${targetType}-${targetId}`;
    this.cache.delete(ratingsKey);
    this.cache.delete(statsKey);
  }

  // Clear all cache
  clearAllCache() {
    this.cache.clear();
  }
}

export default RatingService;
