import { Router, type IRouter } from "express";
import healthRouter from "./health";
import talentsRouter from "./talents";
import bookingsRouter from "./bookings";
import categoriesRouter from "./categories";
import messagesRouter from "./messages";
import reviewsRouter from "./reviews";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(talentsRouter);
router.use(bookingsRouter);
router.use(categoriesRouter);
router.use(messagesRouter);
router.use(reviewsRouter);
router.use(statsRouter);

export default router;
