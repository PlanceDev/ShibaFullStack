"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const referral_1 = require("../controllers/referral");
const router = express_1.default.Router();
router.get("/:id", referral_1.checkReferral);
exports.default = router;
//# sourceMappingURL=referral.js.map