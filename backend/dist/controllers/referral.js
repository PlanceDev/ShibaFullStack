"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReferral = void 0;
const ReferralCode_1 = __importDefault(require("../models/ReferralCode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @route   GET api/referral/:referralId
// @desc    Check if referral exists
// @access  Public
const checkReferral = async (req, res) => {
    try {
        const referralCode = await ReferralCode_1.default.findOne({
            _id: req.params.id,
        });
        if (!referralCode) {
            return res.status(200).send("no-ref");
        }
        const accessToken = jsonwebtoken_1.default.sign({
            _id: referralCode._id,
            referrer: referralCode.owner,
        }, process.env.ACCESS_TOKEN_SECRET || "", {
            expiresIn: "365d",
        });
        res.cookie("referral", accessToken, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
        });
        return res.status(200).send("ref");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Server error.");
    }
};
exports.checkReferral = checkReferral;
//# sourceMappingURL=referral.js.map