import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, messagesTable } from "@workspace/db";
import {
  ListMessagesQueryParams,
  CreateMessageBody,
  ListMessagesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/messages", async (req, res): Promise<void> => {
  const parsed = ListMessagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.bookingId, parsed.data.bookingId))
    .orderBy(asc(messagesTable.createdAt));

  const mapped = messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));
  res.json(ListMessagesResponse.parse(mapped));
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db.insert(messagesTable).values(parsed.data).returning();
  res.status(201).json({ ...message, createdAt: message.createdAt.toISOString() });
});

export default router;
