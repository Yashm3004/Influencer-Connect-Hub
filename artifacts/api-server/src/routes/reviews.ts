import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, reviewsTable, talentsTable } from "@workspace/db";
import {
  ListReviewsQueryParams,
  CreateReviewBody,
  ListReviewsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const parsed = ListReviewsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.talentId, parsed.data.talentId))
    .orderBy(desc(reviewsTable.createdAt));

  const mapped = reviews.map((r) => ({
    ...r,
    bookingId: r.bookingId ?? undefined,
    reviewerCompany: r.reviewerCompany ?? undefined,
    comment: r.comment ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
  res.json(ListReviewsResponse.parse(mapped));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db.insert(reviewsTable).values(parsed.data).returning();

  const allReviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.talentId, parsed.data.talentId));

  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await db
    .update(talentsTable)
    .set({ avgRating })
    .where(eq(talentsTable.id, parsed.data.talentId));

  res.status(201).json({
    ...review,
    bookingId: review.bookingId ?? undefined,
    reviewerCompany: review.reviewerCompany ?? undefined,
    comment: review.comment ?? undefined,
    createdAt: review.createdAt.toISOString(),
  });
});

export default router;
