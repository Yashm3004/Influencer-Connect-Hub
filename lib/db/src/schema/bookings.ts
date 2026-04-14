import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  talentId: integer("talent_id").notNull(),
  businessName: text("business_name").notNull(),
  businessEmail: text("business_email").notNull(),
  campaignName: text("campaign_name").notNull(),
  campaignDescription: text("campaign_description"),
  budget: real("budget").notNull(),
  status: text("status").notNull().default("pending"),
  campaignType: text("campaign_type").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
