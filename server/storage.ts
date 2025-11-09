import {
  users,
  lawyerProfiles,
  bookings,
  messages,
  type User,
  type UpsertUser,
  type LawyerProfile,
  type InsertLawyerProfile,
  type Booking,
  type InsertBooking,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  
  // Lawyer profile operations
  getLawyerProfile(userId: string): Promise<LawyerProfile | undefined>;
  getLawyerProfileById(id: string): Promise<LawyerProfile | undefined>;
  createLawyerProfile(profile: InsertLawyerProfile): Promise<LawyerProfile>;
  updateLawyerProfile(userId: string, updates: Partial<InsertLawyerProfile>): Promise<LawyerProfile>;
  listLawyerProfiles(filters?: { specialization?: string; country?: string; status?: string }): Promise<LawyerProfile[]>;
  updateLawyerStatus(userId: string, status: string, isOnline: boolean): Promise<LawyerProfile>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  listUserBookings(userId: string): Promise<Booking[]>;
  listLawyerBookings(lawyerId: string): Promise<Booking[]>;
  updateBookingStatus(id: string, status: string): Promise<Booking>;
  acceptBooking(id: string): Promise<Booking>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  listBookingMessages(bookingId: string): Promise<Message[]>;
  markMessagesAsRead(bookingId: string, userId: string): Promise<void>;
  getUnreadMessageCount(bookingId: string, userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Lawyer profile operations

  async getLawyerProfile(userId: string): Promise<LawyerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(lawyerProfiles)
      .where(eq(lawyerProfiles.userId, userId));
    return profile;
  }

  async getLawyerProfileById(id: string): Promise<LawyerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(lawyerProfiles)
      .where(eq(lawyerProfiles.id, id));
    return profile;
  }

  async createLawyerProfile(profileData: InsertLawyerProfile): Promise<LawyerProfile> {
    const [profile] = await db
      .insert(lawyerProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updateLawyerProfile(
    userId: string,
    updates: Partial<InsertLawyerProfile>
  ): Promise<LawyerProfile> {
    const [profile] = await db
      .update(lawyerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lawyerProfiles.userId, userId))
      .returning();
    return profile;
  }

  async listLawyerProfiles(filters?: {
    specialization?: string;
    country?: string;
    status?: string;
  }): Promise<LawyerProfile[]> {
    let query = db.select().from(lawyerProfiles);

    if (filters) {
      const conditions = [];
      if (filters.specialization) {
        conditions.push(eq(lawyerProfiles.specialization, filters.specialization));
      }
      if (filters.country) {
        conditions.push(eq(lawyerProfiles.country, filters.country));
      }
      if (filters.status) {
        conditions.push(eq(lawyerProfiles.status, filters.status));
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
    }

    return query.orderBy(desc(lawyerProfiles.eloRating));
  }

  async updateLawyerStatus(
    userId: string,
    status: string,
    isOnline: boolean
  ): Promise<LawyerProfile> {
    const [profile] = await db
      .update(lawyerProfiles)
      .set({ status, isOnline, updatedAt: new Date() })
      .where(eq(lawyerProfiles.userId, userId))
      .returning();
    return profile;
  }

  // Booking operations

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(bookingData)
      .returning();
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking;
  }

  async listUserBookings(userId: string): Promise<Booking[]> {
    return db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async listLawyerBookings(lawyerId: string): Promise<Booking[]> {
    return db
      .select()
      .from(bookings)
      .where(eq(bookings.lawyerId, lawyerId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const updates: any = { status, updatedAt: new Date() };
    
    if (status === "accepted") {
      updates.acceptedAt = new Date();
    } else if (status === "completed") {
      updates.completedAt = new Date();
    }

    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async acceptBooking(id: string): Promise<Booking> {
    return this.updateBookingStatus(id, "accepted");
  }

  // Message operations

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async listBookingMessages(bookingId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.bookingId, bookingId))
      .orderBy(messages.createdAt);
  }

  async markMessagesAsRead(bookingId: string, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ read: true })
      .where(
        and(
          eq(messages.bookingId, bookingId),
          sql`${messages.senderId} != ${userId}`
        )
      );
  }

  async getUnreadMessageCount(bookingId: string, userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          eq(messages.bookingId, bookingId),
          eq(messages.read, false),
          sql`${messages.senderId} != ${userId}`
        )
      );
    return Number(result[0]?.count || 0);
  }
}

export const storage = new DatabaseStorage();
