import { conversions, type Conversion, type InsertConversion } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getConversions(sessionId: string): Promise<Conversion[]>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  clearConversions(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getConversions(sessionId: string): Promise<Conversion[]> {
    return await db.select()
      .from(conversions)
      .where(eq(conversions.sessionId, sessionId))
      .orderBy(desc(conversions.createdAt));
  }

  async createConversion(insertConversion: InsertConversion): Promise<Conversion> {
    const [conversion] = await db
      .insert(conversions)
      .values(insertConversion)
      .returning();
    return conversion;
  }

  async clearConversions(sessionId: string): Promise<void> {
    await db.delete(conversions).where(eq(conversions.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
