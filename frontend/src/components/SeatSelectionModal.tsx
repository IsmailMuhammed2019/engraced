"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  User, 
  Users, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Star,
  MapPin,
  Clock,
  DollarSign,
  ShoppingCart,
  CreditCard,
  AlertCircle,
  Info
} from "lucide-react";

interface Seat {
  id: string;
  number: string;
  type: "window" | "aisle" | "middle";
  row: number;
  column: number;
  isAvailable: boolean;
  isSelected: boolean;
  price: number;
  features: string[];
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  plateNumber: string;
  capacity: number;
  layout: {
    rows: number;
    columns: number;
    totalSeats: number;
  };
}

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  tripId: string;
  onSeatsSelected: (seats: Seat[]) => void;
}

export default function SeatSelectionModal({ 
  isOpen, 
  onClose, 
  vehicle, 
  tripId, 
  onSeatsSelected 
}: SeatSelectionModalProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripPrice, setTripPrice] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      fetchSeatAvailability();
    }
  }, [isOpen, tripId]);

  const fetchSeatAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, fetch trip details to get the real price
      const tripResponse = await fetch(`https://engracedsmile.com/api/v1/trips/${tripId}`);
      let realPrice = 0;
      
      if (tripResponse.ok) {
        const tripData = await tripResponse.json();
        realPrice = parseFloat(tripData.price) || 0;
        setTripPrice(realPrice);
      }
      
      // Fetch seat availability from backend
      const response = await fetch(`https://engracedsmile.com/api/v1/trips/${tripId}/seats`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Backend returns {trip, totalSeats, bookedSeats, availableSeats, availableCount}
        const seatsArray = data.availableSeats || data;
        const bookedSeatsArray = data.bookedSeats || [];
        
        // Transform backend seat format to frontend format
        if (Array.isArray(seatsArray)) {
          // Generate all seats (7 total for Sienna)
          const totalSeatsCount = data.totalSeats || 7;
          const allSeats = [];
          
          for (let i = 0; i < totalSeatsCount; i++) {
            const row = Math.floor(i / 2) + 1;
            const col = (i % 2) + 1;
            const seatNumber = `${String.fromCharCode(64 + row)}${col}`; // A1, A2, B1, B2, etc.
            
            allSeats.push({
              id: `seat-${i}`,
              number: seatNumber,
              type: (col === 1 ? "window" : "aisle") as "window" | "aisle" | "middle",
              row: row,
              column: col,
              isAvailable: !bookedSeatsArray.includes(seatNumber),
              isSelected: false,
              price: realPrice,
              features: col === 1 ? ["Window View"] : ["Aisle Seat"]
            });
          }
          
          setSeats(allSeats);
        } else {
          console.error('Seats data is not in expected format:', data);
          setSeats(generateMockSeats());
        }
      } else {
        console.error('Failed to fetch seats, using fallback');
        setSeats(generateMockSeats());
      }
    } catch (error) {
      console.error('Error fetching seat availability:', error);
      setSeats(generateMockSeats());
    } finally {
      setLoading(false);
    }
  };

  const generateMockSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const { rows, columns } = vehicle.layout;
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= columns; col++) {
        const seatNumber = `${row}${String.fromCharCode(64 + col)}`;
        const isWindow = col === 1 || col === columns;
        const isAisle = col === 2 || col === columns - 1;
        
        seats.push({
          id: `${row}-${col}`,
          number: seatNumber,
          type: isWindow ? "window" : isAisle ? "aisle" : "middle",
          row,
          column: col,
          isAvailable: Math.random() > 0.3, // 70% availability
          isSelected: false,
          price: tripPrice || 0, // Use real trip price
          features: isWindow ? ["Window View"] : isAisle ? ["Extra Legroom"] : []
        });
      }
    }
    
    return seats;
  };

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;
    
    setSeats(prevSeats => 
      prevSeats.map(s => 
        s.id === seat.id 
          ? { ...s, isSelected: !s.isSelected }
          : s
      )
    );

    setSelectedSeats(prev => {
      if (seat.isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, { ...seat, isSelected: true }];
      }
    });
  };

  const getSeatIcon = (seat: Seat) => {
    if (!seat.isAvailable) {
      return <Lock className="h-4 w-4" />;
    }
    if (seat.isSelected) {
      return <CheckCircle className="h-4 w-4" />;
    }
    return <User className="h-4 w-4" />;
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    if (seat.isSelected) {
      return "bg-[#5d4a15] text-white hover:bg-[#6b5618]";
    }
    return "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300";
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }
    
    onSeatsSelected(selectedSeats);
    onClose();
  };

  const renderSeatMap = () => {
    const { rows, columns } = vehicle.layout;
    const seatsByRow: { [key: number]: Seat[] } = {};
    
    seats.forEach(seat => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    });

    return (
      <div className="space-y-4">
        {/* Driver/Engine area */}
        <div className="text-center py-4 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Star className="h-5 w-5" />
            <span className="font-medium">Driver</span>
          </div>
        </div>

        {/* Seat rows */}
        {Object.keys(seatsByRow).map(rowNum => {
          const rowSeats = seatsByRow[parseInt(rowNum)].sort((a, b) => a.column - b.column);
          return (
            <div key={rowNum} className="flex items-center justify-center space-x-2">
              <div className="w-8 text-center text-sm font-medium text-gray-600">
                {rowNum}
              </div>
              <div className="flex space-x-1">
                {rowSeats.map((seat, index) => (
                  <motion.button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={!seat.isAvailable}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${getSeatColor(seat)}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getSeatIcon(seat)}
                  </motion.button>
                ))}
              </div>
              <div className="w-8 text-center text-sm font-medium text-gray-600">
                {rowNum}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#5d4a15] rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Select Your Seats</h2>
                <p className="text-gray-600">
                  {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                </p>
              </div>
              <Button variant="ghost" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading seat availability...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Seats</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <Button onClick={fetchSeatAvailability}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Seat Map */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Seat Map</CardTitle>
                        <CardDescription>
                          Click on available seats to select them
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {renderSeatMap()}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Selection Summary */}
                  <div className="space-y-6">
                    {/* Selected Seats */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Selected Seats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedSeats.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">
                            No seats selected
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {selectedSeats.map(seat => (
                              <div key={seat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="font-medium">Seat {seat.number}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {seat.type}
                                  </Badge>
                                </div>
                                <span className="font-medium">₦{seat.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Price Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Price Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Seats ({selectedSeats.length})</span>
                            <span>₦{getTotalPrice().toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Fee</span>
                            <span>₦500</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span>₦{(getTotalPrice() + 500).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-[#5d4a15] hover:bg-[#6b5618]"
                        onClick={handleConfirmSelection}
                        disabled={selectedSeats.length === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Continue to Payment
                      </Button>
                      <Button variant="outline" className="w-full" onClick={onClose}>
                        Cancel
                      </Button>
                    </div>

                    {/* Seat Type Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Seat Types</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                          <span>Window - Scenic views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                          <span>Aisle - Easy access</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                          <span>Middle - Standard</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
