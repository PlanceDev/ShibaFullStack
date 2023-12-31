"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
// @route   POST /api/user/
// @desc    Login a user
// @access  Public
router.post("/", user_1.loginUser);
exports.default = router;
//# sourceMappingURL=user.js.map