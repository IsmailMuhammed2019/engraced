"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Paperclip, 
  Send, 
  X, 
  MessageCircle, 
  User, 
  Shield, 
  Loader2, 
  Smile, 
  Image as ImageIcon,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface AdminMessage {
  id: string;
  senderId: string;
  senderType: "admin" | "customer";
  content: string;
  timestamp: string;
  read: boolean;
  attachment?: string;
  priority?: "urgent" | "high" | "medium" | "low";
}

interface CustomerSession {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: "open" | "closed" | "pending";
  priority: "urgent" | "high" | "medium" | "low";
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  issueType: "booking" | "payment" | "trip" | "general" | "complaint";
}

interface AdminSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
}


const getPriorityColor = (priority: CustomerSession["priority"]) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const getIssueTypeColor = (issueType: CustomerSession["issueType"]) => {
  switch (issueType) {
    case "booking":
      return "bg-blue-100 text-blue-800";
    case "payment":
      return "bg-green-100 text-green-800";
    case "trip":
      return "bg-purple-100 text-purple-800";
    case "general":
      return "bg-gray-100 text-gray-800";
    case "complaint":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminSupportChat({ isOpen, onClose, adminId }: AdminSupportChatProps) {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customerSessions, setCustomerSessions] = useState<CustomerSession[]>([]);
  const [activeSession, setActiveSession] = useState<CustomerSession | null>(null);
  const [showSessionList, setShowSessionList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCustomerSessions();
    }
  }, [isOpen]);

  const fetchCustomerSessions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/support/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomerSessions(data);
        // Auto-select the first open/pending session
        const firstSession = data.find((s: CustomerSession) => s.status !== "closed");
        if (firstSession) {
          setActiveSession(firstSession);
          fetchMessages(firstSession.id);
          setShowSessionList(false);
        }
      } else {
        setCustomerSessions([]);
      }
    } catch (error) {
      console.error('Error fetching customer sessions:', error);
      setCustomerSessions([]);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/support/sessions/${sessionId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if ((newMessage.trim() === "" && !selectedFile) || !activeSession) return;

    const message: AdminMessage = {
      id: `msg-${Date.now()}`,
      senderId: adminId,
      senderType: "admin",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      attachment: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setSelectedFile(null);
    setIsTyping(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSessionClick = (session: CustomerSession) => {
    setActiveSession(session);
    fetchMessages(session.id);
    setShowSessionList(false);
    // Mark messages as read
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  const handleCloseSession = (sessionId: string) => {
    setCustomerSessions(prev => prev.map(session =>
      session.id === sessionId ? { ...session, status: "closed" } : session
    ));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setShowSessionList(true);
    }
  };

  const handleBackToSessions = () => {
    setShowSessionList(true);
    setActiveSession(null);
    setMessages([]);
  };

  const renderSessionList = () => (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-semibold">Customer Support Sessions</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close chat">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {customerSessions.length === 0 ? (
              <p className="text-center text-gray-500">No active support sessions.</p>
            ) : (
              customerSessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer
                    ${activeSession?.id === session.id ? "bg-blue-100" : "bg-gray-50 hover:bg-gray-100"}
                    ${session.status === "closed" ? "opacity-60" : ""}
                  `}
                  onClick={() => handleSessionClick(session)}
                >
                  <Avatar>
                    <AvatarFallback>{session.customerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{session.customerName}</p>
                      {session.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">{session.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{session.lastMessage}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                      <div className="flex space-x-2">
                        <Badge className={`${getPriorityColor(session.priority)} text-white`}>
                          {session.priority}
                        </Badge>
                        <Badge className={getIssueTypeColor(session.issueType)}>
                          {session.issueType}
                        </Badge>
                      </div>
                      <span>{new Date(session.lastMessageTimestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  {session.status === "open" && (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleCloseSession(session.id); }}>
                      Close
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderChatWindow = () => (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={handleBackToSessions}>
            ← Back
          </Button>
          <Avatar>
            <AvatarFallback>{activeSession?.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{activeSession?.customerName}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {activeSession?.customerEmail} • {activeSession?.customerPhone}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getPriorityColor(activeSession?.priority || "low")} text-white`}>
            {activeSession?.priority}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close chat">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 overflow-hidden">
        <ScrollArea className="h-[calc(100%-60px)] pr-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderType === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.senderType === "admin"
                      ? "bg-[#5d4a15] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.attachment && (
                    <div className="mt-2">
                      {msg.attachment.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                        <img src={msg.attachment} alt="Attachment" className="max-w-full h-auto rounded-md" />
                      ) : (
                        <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                          View Attachment
                        </a>
                      )}
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${msg.senderType === "admin" ? "text-gray-200" : "text-gray-600"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                    {msg.senderType === "admin" && (msg.read ? " ✓✓" : " ✓")}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <div className="border-t p-4 flex items-center space-x-2">
        <Input
          type="file"
          id="file-attachment"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="file-attachment" className="cursor-pointer">
          <Button variant="ghost" size="icon" asChild aria-label="Attach file">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
        </label>

        <Input
          placeholder="Type your response..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-grow"
          disabled={!activeSession}
        />
        <Button onClick={handleSendMessage} disabled={!activeSession || (newMessage.trim() === "" && !selectedFile)}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-4 right-4 h-[600px] w-[400px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
        >
          {showSessionList ? renderSessionList() : renderChatWindow()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
