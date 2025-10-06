"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent" | "system";
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
}

interface ChatSession {
  id: string;
  agentId?: string;
  agentName?: string;
  status: "waiting" | "active" | "ended";
  startTime: string;
  endTime?: string;
  rating?: number;
  tags: string[];
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function SupportChat({ isOpen, onClose, userId }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [quickReplies] = useState([
    "I need help with my booking",
    "I want to cancel my trip",
    "I have a complaint",
    "I need a refund",
    "I want to change my seat",
    "I need help with payment"
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/v1/support/chat/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        setMessages(data.messages || []);
      } else {
        // Fallback to mock data
        setSession(getMockSession());
        setMessages(getMockMessages());
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      setSession(getMockSession());
      setMessages(getMockMessages());
    }
  };

  const getMockSession = (): ChatSession => ({
    id: "CHAT-001",
    agentId: "AGENT-001",
    agentName: "Sarah Johnson",
    status: "active",
    startTime: new Date().toISOString(),
    tags: ["booking", "payment"]
  });

  const getMockMessages = (): Message[] => [
    {
      id: "1",
      text: "Hello! I'm Sarah, your support agent. How can I help you today?",
      sender: "agent",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: "text",
      status: "read"
    },
    {
      id: "2",
      text: "Hi Sarah, I'm having trouble with my booking confirmation. I haven't received my ticket yet.",
      sender: "user",
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: "text",
      status: "read"
    },
    {
      id: "3",
      text: "I understand your concern. Let me check your booking details. Can you please provide your booking reference number?",
      sender: "agent",
      timestamp: new Date(Date.now() - 180000).toISOString(),
      type: "text",
      status: "read"
    },
    {
      id: "4",
      text: "Sure, it's ENG-123456",
      sender: "user",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      type: "text",
      status: "read"
    }
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sent"
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate agent typing
    setIsTyping(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/v1/support/chat/message', {
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
          setMessages(prev => [...prev, data.agentMessage]);
          setIsTyping(false);
        }, 1500);
      } else {
        // Fallback to mock response
        setTimeout(() => {
          const mockResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "Thank you for that information. Let me look into your booking and get back to you shortly.",
            sender: "agent",
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
          sender: "agent",
          timestamp: new Date().toISOString(),
          type: "text",
          status: "delivered"
        };
        setMessages(prev => [...prev, mockResponse]);
        setIsTyping(false);
      }, 1500);
    }

    setAttachments([]);
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
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
                    {isMinimized ? 'Support' : 'Customer Support'}
                  </CardTitle>
                  {!isMinimized && session && (
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{session.agentName || 'Connecting...'}</span>
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
              {/* Messages */}
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-[#5d4a15] text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-[#5d4a15] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`text-xs ${
                              message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            {message.sender === 'user' && getMessageStatusIcon(message.status)}
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
                </div>

                {/* Quick Replies */}
                {messages.length === 0 && (
                  <div className="p-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">Quick replies:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

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
