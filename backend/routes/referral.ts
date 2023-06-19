import express from "express";
import { checkReferral } from "../controllers/referral";

const router = express.Router();

router.get("/:id", checkReferral);

export default router;
