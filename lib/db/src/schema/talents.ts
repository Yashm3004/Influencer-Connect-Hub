import { pgTable, text, serial, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const talentsTable = pgTable("talents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  bio: text("bio").notNull(),
  profileImageUrl: text("profile_image_url"),
  coverImageUrl: text("cover_image_url"),
  followerCount: integer("follower_count").notNull().default(0),
  engagementRate: real("engagement_rate"),
  ratePerPost: real("rate_per_post").notNull().default(0),
  ratePerCampaign: real("rate_per_campaign"),
  platforms: text("platforms").array(),
  niche: text("niche"),
  location: text("location"),
  verified: boolean("verified").notNull().default(false),
  available: boolean("available").notNull().default(true),
  managerName: text("manager_name"),
  managerEmail: text("manager_email"),
  avgRating: real("avg_rating"),
  totalBookings: integer("total_bookings").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTalentSchema = createInsertSchema(talentsTable).omit({ id: true, createdAt: true });
export type InsertTalent = z.infer<typeof insertTalentSchema>;
export type Talent = typeof talentsTable.$inferSelect;
