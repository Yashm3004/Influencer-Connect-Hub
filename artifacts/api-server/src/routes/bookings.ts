import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, bookingsTable, talentsTable, activityTable } from "@workspace/db";
import {
  ListBookingsQueryParams,
  CreateBookingBody,
  GetBookingParams,
  GetBookingResponse,
  ListBookingsResponse,
  UpdateBookingParams,
  UpdateBookingBody,
  UpdateBookingResponse,
} from "@workspace/api-zod";
import type { Talent, Booking } from "@workspace/db";

function mapTalent(t: Talent) {
  return {
    ...t,
    profileImageUrl: t.profileImageUrl ?? undefined,
    coverImageUrl: t.coverImageUrl ?? undefined,
    niche: t.niche ?? undefined,
    location: t.location ?? undefined,
    managerName: t.managerName ?? undefined,
    managerEmail: t.managerEmail ?? undefined,
    engagementRate: t.engagementRate ?? undefined,
    ratePerCampaign: t.ratePerCampaign ?? undefined,
    avgRating: t.avgRating ?? undefined,
    platforms: t.platforms ?? undefined,
    createdAt: t.createdAt.toISOString(),
  };
}

function mapBooking(booking: Booking, talent: Talent | null) {
  return {
    ...booking,
    campaignDescription: booking.campaignDescription ?? undefined,
    startDate: booking.startDate ?? undefined,
    endDate: booking.endDate ?? undefined,
    createdAt: booking.createdAt.toISOString(),
    talent: talent ? mapTalent(talent) : undefined,
  };
}

const router: IRouter = Router();

router.get("/bookings", async (req, res): Promise<void> => {
  const parsed = ListBookingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status } = parsed.data;

  const bookingsData = await db
    .select()
    .from(bookingsTable)
    .where(status ? eq(bookingsTable.status, status) : undefined)
    .orderBy(desc(bookingsTable.createdAt));

  const bookingsWithTalents = await Promise.all(
    bookingsData.map(async (booking) => {
      const [talent] = await db
        .select()
        .from(talentsTable)
        .where(eq(talentsTable.id, booking.talentId));
      return mapBooking(booking, talent ?? null);
    })
  );

  res.json(ListBookingsResponse.parse(bookingsWithTalents));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();

  const [talent] = await db.select().from(talentsTable).where(eq(talentsTable.id, booking.talentId));

  await db.insert(activityTable).values({
    type: "booking_created",
    description: `New booking request from ${booking.businessName}`,
    entityName: talent?.name ?? "Unknown Talent",
  });

  res.status(201).json(GetBookingResponse.parse(mapBooking(booking, talent ?? null)));
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const params = GetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [talent] = await db.select().from(talentsTable).where(eq(talentsTable.id, booking.talentId));

  res.json(GetBookingResponse.parse(mapBooking(booking, talent ?? null)));
});

router.patch("/bookings/:id", async (req, res): Promise<void> => {
  const params = UpdateBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [booking] = await db
    .update(bookingsTable)
    .set(parsed.data)
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [talent] = await db.select().from(talentsTable).where(eq(talentsTable.id, booking.talentId));

  if (parsed.data.status === "accepted") {
    await db.insert(activityTable).values({
      type: "booking_accepted",
      description: `Booking accepted for ${booking.businessName}`,
      entityName: talent?.name ?? "Unknown Talent",
    });
  } else if (parsed.data.status === "completed") {
    await db.insert(activityTable).values({
      type: "booking_completed",
      description: `Campaign completed for ${booking.businessName}`,
      entityName: talent?.name ?? "Unknown Talent",
    });
  }

  res.json(UpdateBookingResponse.parse(mapBooking(booking, talent ?? null)));
});

export default router;
