"use client";
/* eslint-disable */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Bot,
  Paperclip,
  Smile,
  X,
  Minimize2,
  Maximize2,
  Settings,
  HelpCircle,
  FileText,
  Image,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreVertical,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Crown,
  Award,
  Zap,
  Heart,
  Flag,
  Archive,
  Trash2,
  Edit,
  Copy,
  Share2
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "customer" | "admin";
  senderId: string;
  senderName: string;
  timestamp: string;
  type: "text" | "image" | "file" | "system";
  status: "sent" | "delivered" | "read" | "failed";
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  quickReplies?: string[];
  isEdited?: boolean;
  editedAt?: string;
}

interface ChatSession {
  id: string;
  customerId: string;
  customerName: string;
  adminId?: string;
  adminName?: string;
  status: "waiting" | "active" | "ended" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  category: "booking" | "payment" | "technical" | "general" | "complaint";
  startTime: string;
  endTime?: string;
  rating?: number;
  tags: string[];
  metadata?: {
    bookingId?: string;
    tripId?: string;
    amount?: number;
    route?: string;
  };
}

interface CustomerAdminChatProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "customer" | "admin";
  userId: string;
  sessionId?: string;
  customerId?: string; // For admin view
}

export default function CustomerAdminChat({ 
  isOpen, 
  onClose, 
  userType, 
  userId, 
  sessionId,
  customerId 
}: CustomerAdminChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (userType === 'admin') {
        fetchAdminSessions();
      } else {
        initializeCustomerChat();
      }
    }
  }, [isOpen, userType, userId, sessionId, customerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAdminSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/admin/chat/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
        if (data.length > 0 && !selectedSession) {
          setSelectedSession(data[0].id);
          fetchMessages(data[0].id);
        }
      } else {
        setSessions(getMockSessions());
        if (getMockSessions().length > 0) {
          setSelectedSession(getMockSessions()[0].id);
          fetchMessages(getMockSessions()[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching admin sessions:', error);
      setSessions(getMockSessions());
      if (getMockSessions().length > 0) {
        setSelectedSession(getMockSessions()[0].id);
        fetchMessages(getMockSessions()[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeCustomerChat = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/v1/chat/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          customerId: userId,
          category: 'general'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        setMessages(data.messages || []);
      } else {
        const mockSession = getMockCustomerSession();
        setSession(mockSession);
        setMessages(getMockMessages());
      }
    } catch (error) {
      console.error('Error initializing customer chat:', error);
      const mockSession = getMockCustomerSession();
      setSession(mockSession);
      setMessages(getMockMessages());
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const token = localStorage.getItem(userType === 'admin' ? 'adminToken' : 'token');
      const response = await fetch(`http://localhost:3003/api/v1/chat/${sessionId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setSession(data.session);
      } else {
        setMessages(getMockMessages());
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages(getMockMessages());
    }
  };

  const getMockSessions = (): ChatSession[] => [
    {
      id: "SESSION-001",
      customerId: "CUST-001",
      customerName: "John Doe",
      adminId: "ADMIN-001",
      adminName: "Sarah Johnson",
      status: "active",
      priority: "high",
      category: "booking",
      startTime: new Date(Date.now() - 3600000).toISOString(),
      tags: ["urgent", "booking"],
      metadata: {
        bookingId: "ENG-123456",
        route: "Lagos → Abuja",
        amount: 15000
      }
    },
    {
      id: "SESSION-002",
      customerId: "CUST-002",
      customerName: "Jane Smith",
      status: "waiting",
      priority: "medium",
      category: "payment",
      startTime: new Date(Date.now() - 1800000).toISOString(),
      tags: ["payment"],
      metadata: {
        bookingId: "ENG-789012",
        amount: 25000
      }
    },
    {
      id: "SESSION-003",
      customerId: "CUST-003",
      customerName: "Mike Johnson",
      adminId: "ADMIN-002",
      adminName: "David Wilson",
      status: "ended",
      priority: "low",
      category: "general",
      startTime: new Date(Date.now() - 7200000).toISOString(),
      endTime: new Date(Date.now() - 3600000).toISOString(),
      rating: 5,
      tags: ["resolved"]
    }
  ];

  const getMockCustomerSession = (): ChatSession => ({
    id: "SESSION-001",
    customerId: userId,
    customerName: "You",
    adminId: "ADMIN-001",
    adminName: "Sarah Johnson",
    status: "active",
    priority: "medium",
    category: "general",
    startTime: new Date(Date.now() - 1800000).toISOString(),
    tags: ["new"]
  });

  const getMockMessages = (): Message[] => [
    {
      id: "1",
      text: "Hello! I'm Sarah, your support agent. How can I help you today?",
      sender: "admin",
      senderId: "ADMIN-001",
      senderName: "Sarah Johnson",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: "text",
      status: "read"
    },
    {
      id: "2",
      text: "Hi Sarah, I'm having trouble with my booking confirmation. I haven't received my ticket yet.",
      sender: "customer",
      senderId: userId,
      senderName: userType === 'customer' ? "You" : "John Doe",
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      type: "text",
      status: "read"
    },
    {
      id: "3",
      text: "I understand your concern. Let me check your booking details. Can you please provide your booking reference number?",
      sender: "admin",
      senderId: "ADMIN-001",
      senderName: "Sarah Johnson",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      type: "text",
      status: "read"
    },
    {
      id: "4",
      text: "Sure, it's ENG-123456",
      sender: "customer",
      senderId: userId,
      senderName: userType === 'customer' ? "You" : "John Doe",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      type: "text",
      status: "read"
    }
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: userType,
      senderId: userId,
      senderName: userType === 'customer' ? "You" : "Admin",
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sent"
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate admin typing
    if (userType === 'customer') {
      setIsTyping(true);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3003/api/v1/chat/message', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionId: session?.id,
            message: text.trim(),
            attachments: attachments.map(file => ({
              name: file.name,
              type: file.type,
              size: file.size
            }))
          })
        });

        if (response.ok) {
          const data = await response.json();
          setTimeout(() => {
            setMessages(prev => [...prev, data.adminMessage]);
            setIsTyping(false);
          }, 1500);
        } else {
          // Fallback to mock response
          setTimeout(() => {
            const mockResponse: Message = {
              id: (Date.now() + 1).toString(),
              text: "Thank you for that information. Let me look into your booking and get back to you shortly.",
              sender: "admin",
              senderId: "ADMIN-001",
              senderName: "Sarah Johnson",
              timestamp: new Date().toISOString(),
              type: "text",
              status: "delivered"
            };
            setMessages(prev => [...prev, mockResponse]);
            setIsTyping(false);
          }, 1500);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Mock response on error
        setTimeout(() => {
          const mockResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "I'm sorry, I'm experiencing some technical difficulties. Let me get back to you shortly.",
            sender: "admin",
            senderId: "ADMIN-001",
            senderName: "Sarah Johnson",
            timestamp: new Date().toISOString(),
            type: "text",
            status: "delivered"
          };
          setMessages(prev => [...prev, mockResponse]);
          setIsTyping(false);
        }, 1500);
      }
    }

    setAttachments([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case "read":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${
          isMinimized ? 'w-80 h-16' : userType === 'admin' ? 'w-[800px] h-[700px]' : 'w-96 h-[600px]'
        } transition-all duration-300`}
      >
        <Card className="w-full h-full shadow-2xl">
          {/* Header */}
          <CardHeader className="bg-[#5d4a15] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">
                    {userType === 'admin' ? 'Customer Support' : 'Support Chat'}
                  </CardTitle>
                  {!isMinimized && session && (
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{userType === 'admin' ? session.customerName : session.adminName || 'Connecting...'}</span>
                      {userType === 'admin' && (
                        <Badge className={`text-xs ${getPriorityColor(session.priority)}`}>
                          {session.priority}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              {/* Admin Session List */}
              {userType === 'admin' && (
                <div className="border-b p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {sessions.map((session) => (
                      <Button
                        key={session.id}
                        variant={selectedSession === session.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session.id);
                          fetchMessages(session.id);
                        }}
                        className="whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            session.status === 'active' ? 'bg-green-500' : 
                            session.status === 'waiting' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`} />
                          <span>{session.customerName}</span>
                          <Badge className={`text-xs ${getPriorityColor(session.priority)}`}>
                            {session.priority}
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5d4a15]" />
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === userType ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[80%] ${
                            message.sender === userType ? 'flex-row-reverse' : 'flex-row'
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender === userType 
                                ? 'bg-[#5d4a15] text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {message.sender === userType ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`p-3 rounded-lg ${
                              message.sender === userType
                                ? 'bg-[#5d4a15] text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium opacity-70">
                                  {message.senderName}
                                </span>
                                {message.isEdited && (
                                  <span className="text-xs opacity-50">(edited)</span>
                                )}
                              </div>
                              <p className="text-sm">{message.text}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className={`text-xs ${
                                  message.sender === userType ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                                {message.sender === userType && getMessageStatusIcon(message.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="h-4 w-4 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-500"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => sendMessage(newMessage)}
                      disabled={!newMessage.trim()}
                      size="sm"
                      className="bg-[#5d4a15] hover:bg-[#6b5618]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
