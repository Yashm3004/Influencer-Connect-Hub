import { Router, type IRouter } from "express";
import { eq, ilike, gte, lte, and, desc } from "drizzle-orm";
import { db, talentsTable } from "@workspace/db";
import {
  ListTalentsQueryParams,
  CreateTalentBody,
  GetTalentParams,
  GetTalentResponse,
  ListTalentsResponse,
  GetFeaturedTalentsResponse,
} from "@workspace/api-zod";
import type { Talent } from "@workspace/db";

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

const router: IRouter = Router();

router.get("/talents/featured", async (req, res): Promise<void> => {
  const talents = await db
    .select()
    .from(talentsTable)
    .where(eq(talentsTable.verified, true))
    .orderBy(desc(talentsTable.followerCount))
    .limit(8);
  res.json(GetFeaturedTalentsResponse.parse(talents.map(mapTalent)));
});

router.get("/talents", async (req, res): Promise<void> => {
  const parsed = ListTalentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, search, minFollowers, maxRate } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(talentsTable.category, category));
  if (search) conditions.push(ilike(talentsTable.name, `%${search}%`));
  if (minFollowers) conditions.push(gte(talentsTable.followerCount, minFollowers));
  if (maxRate) conditions.push(lte(talentsTable.ratePerPost, maxRate));

  const talents = await db
    .select()
    .from(talentsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(talentsTable.createdAt));

  res.json(ListTalentsResponse.parse(talents.map(mapTalent)));
});

router.post("/talents", async (req, res): Promise<void> => {
  const parsed = CreateTalentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [talent] = await db.insert(talentsTable).values(parsed.data).returning();
  res.status(201).json(GetTalentResponse.parse(mapTalent(talent)));
});

router.get("/talents/:id", async (req, res): Promise<void> => {
  const params = GetTalentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [talent] = await db
    .select()
    .from(talentsTable)
    .where(eq(talentsTable.id, params.data.id));

  if (!talent) {
    res.status(404).json({ error: "Talent not found" });
    return;
  }

  res.json(GetTalentResponse.parse(mapTalent(talent)));
});

export default router;
