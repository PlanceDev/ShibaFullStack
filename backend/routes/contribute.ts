import express from "express";
import { purchaseTokens } from "../controllers/contribute";

const router = express.Router();

router.post("/", purchaseTokens);

export default router;
