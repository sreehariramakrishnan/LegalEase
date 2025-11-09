import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Phone, Video, MoreVertical } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Message, Booking } from "@shared/schema";
import { format } from "date-fns";

interface BookingWithParticipants extends Booking {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
  lawyer: {
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  const { data: bookings = [], isLoading } = useQuery<BookingWithParticipants[]>({
    queryKey: ["/api/bookings"],
  });

  const acceptedBookings = bookings.filter(b => b.status === "accepted");

  useEffect(() => {
    if (!user?.id) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: 'join',
        userId: user.id
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message' && data.bookingId === selectedBooking) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [user?.id, selectedBooking]);

  const { data: currentMessages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedBooking],
    enabled: !!selectedBooking,
  });

  useEffect(() => {
    setMessages(currentMessages);
  }, [currentMessages, selectedBooking]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedBooking) return;
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking,
          content,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    },
    onSuccess: (newMessage: Message) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'message',
          bookingId: selectedBooking,
          message: newMessage
        }));
      }
      setMessages(prev => [...prev, newMessage]);
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedBooking] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedBooking) return;
    sendMessageMutation.mutate(messageText);
  };

  const selectedBookingData = acceptedBookings.find(b => b.id === selectedBooking);
  const otherParticipant = selectedBookingData
    ? user?.role === "lawyer"
      ? selectedBookingData.user
      : selectedBookingData.lawyer
    : null;
  const otherParticipantName = otherParticipant
    ? `${otherParticipant.firstName || ""} ${otherParticipant.lastName || ""}`.trim()
    : "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (acceptedBookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-12 max-w-md">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Active Chats</h2>
            <p className="text-muted-foreground mb-6">
              You don't have any accepted bookings yet. {user?.role === "user" ? "Book a lawyer" : "Accept booking requests"} to start chatting.
            </p>
            <Button asChild data-testid="button-find-lawyers">
              <a href="/lawyers">
                {user?.role === "user" ? "Find Lawyers" : "View Dashboard"}
              </a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-sm text-muted-foreground">
            {acceptedBookings.length} active conversation{acceptedBookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {acceptedBookings.map((booking) => {
              const other = user?.role === "lawyer" ? booking.user : booking.lawyer;
              const otherName = `${other.firstName || ""} ${other.lastName || ""}`.trim();
              const initials = otherName
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <Card
                  key={booking.id}
                  className={`cursor-pointer hover-elevate active-elevate-2 ${
                    selectedBooking === booking.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedBooking(booking.id)}
                  data-testid={`chat-item-${booking.id}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={other.profileImageUrl || ""} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold truncate">{otherName}</p>
                          <Badge variant="secondary" className="text-xs">
                            {booking.contactPreference || "in-app"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {booking.caseDescription.slice(0, 40)}...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      <div className="flex-1 flex flex-col">
        {selectedBooking ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant?.profileImageUrl || ""} />
                  <AvatarFallback>
                    {otherParticipantName
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{otherParticipantName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedBookingData?.contactPreference || "in-app"} - {selectedBookingData?.caseDescription.slice(0, 30)}...
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedBookingData?.contactPreference === "phone" && (
                  <Button size="icon" variant="ghost" data-testid="button-phone-call">
                    <Phone className="h-5 w-5" />
                  </Button>
                )}
                {selectedBookingData?.contactPreference === "whatsapp" && (
                  <Button size="icon" variant="ghost" data-testid="button-video-call">
                    <Video className="h-5 w-5" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" data-testid="button-chat-options">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, idx) => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      data-testid={`message-${idx}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {message.createdAt ? format(new Date(message.createdAt), "MMM d, h:mm a") : "Just now"}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  data-testid="input-message"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
