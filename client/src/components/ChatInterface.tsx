import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  timestamp: Date;
}

interface ChatInterfaceProps {
  country?: string;
  language?: string;
}

export function ChatInterface({ country = "IN", language = "en" }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm your AI legal assistant powered by Gemini. I'm currently configured for ${country === "IN" ? "India" : country} legal system. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI chat mutation
  const aiChatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const conversationHistory = messages
        .filter(msg => msg.id !== "1") // Exclude initial greeting
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await apiRequest('POST', '/api/ai-chat', {
        message: userMessage,
        country,
        language,
        conversationHistory,
      });

      const data: { content: string; citations?: string[] } = await response.json();
      return data;
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
        citations: data.citations,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      // Remove typing indicator by adding error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try asking your question again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSend = () => {
    if (!input.trim() || aiChatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input;
    setInput("");
    
    // Send to AI
    aiChatMutation.mutate(messageToSend);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              data-testid={`message-${message.role}-${message.id}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-chart-2 text-white"}>
                  {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col max-w-[70%] ${message.role === "user" ? "items-end" : ""}`}>
                <Card className={`p-3 ${message.role === "user" ? "bg-chart-2 text-white" : ""}`}>
                  <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    {message.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs font-semibold mb-1">Citations:</p>
                      {message.citations.map((citation, idx) => (
                        <p key={idx} className="text-xs opacity-90">• {citation}</p>
                      ))}
                    </div>
                  )}
                </Card>
                <span className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {aiChatMutation.isPending && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a legal question..."
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button 
            onClick={handleSend} 
            disabled={aiChatMutation.isPending}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
