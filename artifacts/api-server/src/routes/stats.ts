import { Router, type IRouter } from "express";
import { eq, count, sum, desc } from "drizzle-orm";
import { db, talentsTable, bookingsTable, activityTable } from "@workspace/db";
import {
  GetPlatformStatsResponse,
  GetBookingsByCategoryResponse,
  GetRecentActivityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/platform", async (_req, res): Promise<void> => {
  const [talentsResult] = await db.select({ count: count() }).from(talentsTable);
  const [bookingsResult] = await db.select({ count: count() }).from(bookingsTable);
  const [revenueResult] = await db
    .select({ total: sum(bookingsTable.budget) })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "completed"));
  const [activeResult] = await db
    .select({ count: count() })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "accepted"));
  const [completedResult] = await db
    .select({ count: count() })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "completed"));

  const businesses = await db
    .selectDistinct({ businessEmail: bookingsTable.businessEmail })
    .from(bookingsTable);

  const stats = {
    totalTalents: talentsResult?.count ?? 0,
    totalBookings: bookingsResult?.count ?? 0,
    totalBusinesses: businesses.length,
    completedCampaigns: completedResult?.count ?? 0,
    totalRevenue: Number(revenueResult?.total ?? 0),
    activeBookings: activeResult?.count ?? 0,
  };

  res.json(GetPlatformStatsResponse.parse(stats));
});

router.get("/stats/bookings-by-category", async (_req, res): Promise<void> => {
  const talents = await db.select().from(talentsTable);
  const bookings = await db.select().from(bookingsTable);

  const categoryMap: Record<string, { count: number; totalRevenue: number }> = {};

  for (const booking of bookings) {
    const talent = talents.find((t) => t.id === booking.talentId);
    if (!talent) continue;
    const cat = talent.category;
    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, totalRevenue: 0 };
    categoryMap[cat].count++;
    if (booking.status === "completed") {
      categoryMap[cat].totalRevenue += booking.budget;
    }
  }

  const result = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    count: data.count,
    totalRevenue: data.totalRevenue,
  }));

  res.json(GetBookingsByCategoryResponse.parse(result));
});

router.get("/stats/recent-activity", async (_req, res): Promise<void> => {
  const activities = await db
    .select()
    .from(activityTable)
    .orderBy(desc(activityTable.createdAt))
    .limit(20);

  const mapped = activities.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));
  res.json(GetRecentActivityResponse.parse(mapped));
});

export default router;
