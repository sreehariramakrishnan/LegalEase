import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLawyerProfileSchema, insertBookingSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user is a lawyer, include their profile
      let lawyerProfile = null;
      if (user.role === "lawyer") {
        lawyerProfile = await storage.getLawyerProfile(userId);
      }

      res.json({ ...user, lawyerProfile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user role (used during onboarding)
  app.post('/api/auth/user/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;

      if (!["user", "lawyer"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.updateUserRole(userId, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  // Lawyer profile routes
  app.post('/api/lawyer-profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (user?.role !== "lawyer") {
        return res.status(403).json({ message: "Only lawyers can create profiles" });
      }

      const profileData = insertLawyerProfileSchema.parse({
        ...req.body,
        userId,
      });

      const profile = await storage.createLawyerProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating lawyer profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.get('/api/lawyer-profiles/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getLawyerProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching lawyer profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch('/api/lawyer-profiles/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;

      const profile = await storage.updateLawyerProfile(userId, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating lawyer profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get('/api/lawyer-profiles', async (req, res) => {
    try {
      const { specialization, country, status } = req.query;
      
      const profiles = await storage.listLawyerProfiles({
        specialization: specialization as string,
        country: country as string,
        status: status as string,
      });

      // Include user information for each profile
      const profilesWithUsers = await Promise.all(
        profiles.map(async (profile) => {
          const user = await storage.getUser(profile.userId);
          return {
            ...profile,
            user: {
              firstName: user?.firstName,
              lastName: user?.lastName,
              profileImageUrl: user?.profileImageUrl,
            },
          };
        })
      );

      res.json(profilesWithUsers);
    } catch (error) {
      console.error("Error listing lawyer profiles:", error);
      res.status(500).json({ message: "Failed to list profiles" });
    }
  });

  app.get('/api/lawyer-profiles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.getLawyerProfileById(id);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const user = await storage.getUser(profile.userId);
      res.json({
        ...profile,
        user: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          profileImageUrl: user?.profileImageUrl,
        },
      });
    } catch (error) {
      console.error("Error fetching lawyer profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch('/api/lawyer-profiles/me/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status, isOnline } = req.body;

      const profile = await storage.updateLawyerStatus(userId, status, isOnline);
      res.json(profile);
    } catch (error) {
      console.error("Error updating lawyer status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Booking routes
  app.post('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId,
      });

      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get('/api/bookings/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.listUserBookings(userId);
      
      // Include lawyer details
      const bookingsWithLawyers = await Promise.all(
        bookings.map(async (booking) => {
          const lawyer = await storage.getUser(booking.lawyerId);
          const lawyerProfile = await storage.getLawyerProfile(booking.lawyerId);
          return {
            ...booking,
            lawyer: {
              firstName: lawyer?.firstName,
              lastName: lawyer?.lastName,
              profileImageUrl: lawyer?.profileImageUrl,
              specialization: lawyerProfile?.specialization,
            },
          };
        })
      );

      res.json(bookingsWithLawyers);
    } catch (error) {
      console.error("Error listing user bookings:", error);
      res.status(500).json({ message: "Failed to list bookings" });
    }
  });

  app.get('/api/bookings/lawyer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.listLawyerBookings(userId);
      
      // Include user details
      const bookingsWithUsers = await Promise.all(
        bookings.map(async (booking) => {
          const user = await storage.getUser(booking.userId);
          return {
            ...booking,
            user: {
              firstName: user?.firstName,
              lastName: user?.lastName,
              profileImageUrl: user?.profileImageUrl,
            },
          };
        })
      );

      res.json(bookingsWithUsers);
    } catch (error) {
      console.error("Error listing lawyer bookings:", error);
      res.status(500).json({ message: "Failed to list bookings" });
    }
  });

  app.get('/api/bookings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Check if user is authorized to view this booking
      if (booking.userId !== userId && booking.lawyerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  app.patch('/api/bookings/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.claims.sub;
      
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Only the lawyer can accept/reject, both can complete/cancel
      if (status === "accepted" || status === "rejected") {
        if (booking.lawyerId !== userId) {
          return res.status(403).json({ message: "Only the lawyer can accept or reject" });
        }
      } else if (booking.userId !== userId && booking.lawyerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });

      // Verify user is part of this booking
      const booking = await storage.getBooking(messageData.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (booking.userId !== userId && booking.lawyerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const message = await storage.createMessage(messageData);
      
      // Emit via WebSocket
      const io = (req.app as any).io as SocketIOServer;
      if (io) {
        io.to(messageData.bookingId).emit("new_message", message);
      }

      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.get('/api/messages/:bookingId', isAuthenticated, async (req: any, res) => {
    try {
      const { bookingId } = req.params;
      const userId = req.user.claims.sub;
      
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (booking.userId !== userId && booking.lawyerId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const messages = await storage.listBookingMessages(bookingId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(bookingId, userId);

      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/messages/:bookingId/unread', isAuthenticated, async (req: any, res) => {
    try {
      const { bookingId } = req.params;
      const userId = req.user.claims.sub;
      
      const count = await storage.getUnreadMessageCount(bookingId, userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  // AI Chat endpoint with Gemini
  app.post('/api/ai-chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, country, language, conversationHistory } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Initialize Gemini AI
      const genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      // Country-specific legal context
      const countryContext: Record<string, string> = {
        IN: "Indian legal system, including the Constitution of India, Indian Penal Code (IPC), Civil Procedure Code (CPC), Criminal Procedure Code (CrPC), and relevant statutes",
        US: "United States legal system, including federal and state laws, US Constitution, and common law principles",
        UK: "United Kingdom legal system, including English common law, statutory law, and relevant UK legislation",
        CA: "Canadian legal system, including federal and provincial laws, Canadian Charter of Rights and Freedoms",
        AU: "Australian legal system, including Commonwealth and state laws, Australian Constitution",
      };

      // Language-specific instructions
      const languageInstructions: Record<string, string> = {
        en: "Respond in clear, professional English",
        hi: "Respond in Hindi (हिंदी में जवाब दें)",
        es: "Respond in Spanish (Responda en español)",
        fr: "Respond in French (Répondez en français)",
      };

      const systemPrompt = `You are an AI legal assistant powered by Gemini, specializing in ${countryContext[country] || "general legal principles"}.

Your role:
- Provide accurate, helpful legal information based on ${country || "general"} law
- ${languageInstructions[language] || "Respond in English"}
- Always include relevant legal citations and references when applicable
- Clarify that you provide general legal information, not formal legal advice
- If a question is outside your jurisdiction or expertise, acknowledge limitations
- Be concise but thorough, explaining complex legal concepts in accessible language

Important disclaimers:
- You are an AI assistant providing general legal information
- This is NOT a substitute for professional legal counsel
- Users should consult licensed attorneys for specific legal matters
- Laws vary by jurisdiction and change over time

When providing citations, format them as an array of strings that can be displayed separately.`;

      // Build conversation history for context
      const conversationParts = [];
      
      if (conversationHistory && Array.isArray(conversationHistory)) {
        conversationHistory.forEach((msg: any) => {
          conversationParts.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        });
      }

      // Add current message
      conversationParts.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Generate response with Gemini
      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          ...conversationParts,
        ],
      });

      const aiResponse = response.text || "I apologize, but I couldn't generate a response. Please try again.";

      // Extract potential citations (look for common legal citation patterns)
      const citations: string[] = [];
      const citationPatterns = [
        /(?:Section|Article|Chapter|Rule|Act)\s+\d+[A-Za-z]?\s+(?:of\s+)?[A-Za-z\s,()]+(?:Act|Code|Constitution)/g,
        /\d+\s+U\.S\.C\.\s+§\s+\d+/g,
        /\[\d{4}\]\s+\w+\s+\d+/g,
      ];

      citationPatterns.forEach(pattern => {
        const matches = aiResponse.match(pattern);
        if (matches) {
          citations.push(...matches.slice(0, 5)); // Limit to 5 citations
        }
      });

      res.json({
        content: aiResponse,
        citations: citations.length > 0 ? Array.from(new Set(citations)) : undefined,
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ 
        message: "Failed to generate AI response",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  // Setup WebSocket for real-time messaging
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("join_booking", (bookingId: string) => {
      socket.join(bookingId);
      console.log(`User ${socket.id} joined booking ${bookingId}`);
    });

    socket.on("leave_booking", (bookingId: string) => {
      socket.leave(bookingId);
      console.log(`User ${socket.id} left booking ${bookingId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Make io accessible to routes
  (app as any).io = io;

  return httpServer;
}
