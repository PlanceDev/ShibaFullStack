"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseTokens = void 0;
const User_1 = __importDefault(require("../models/User"));
const ReferralCode_1 = __importDefault(require("../models/ReferralCode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @route   POST api/contribute/
// @desc    Purchase tokens
// @access  Public
const purchaseTokens = async (req, res) => {
    var _a, _b, _c;
    try {
        if (!req.body.address) {
            return res.status(400).send("No address provided.");
        }
        let contributor = await User_1.default.findOne({ publicKey: req.body.address });
        if (!contributor) {
            return res.status(400).send("No contributor found.");
        }
        const accessToken = ((_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split("=")[1]) || "";
        if (accessToken) {
            const decodedToken = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "", (error, decoded) => {
                if (error) {
                    return null;
                }
                else {
                    return decoded;
                }
            });
            if (decodedToken) {
                const referrer = await User_1.default.findOne({
                    isAffiliate: true,
                    referralCode: decodedToken._id,
                });
                if ((referrer === null || referrer === void 0 ? void 0 : referrer.publicKey) === req.body.address) {
                    return;
                }
                if (referrer && !((_b = referrer.referrals) === null || _b === void 0 ? void 0 : _b.includes(req.body.address))) {
                    (_c = referrer.referrals) === null || _c === void 0 ? void 0 : _c.push(req.body.address);
                    await referrer.save();
                }
            }
        }
        // Create new referral code
        const newReferralCode = new ReferralCode_1.default({
            owner: req.body.address,
        });
        contributor.isAffiliate = true;
        contributor.referralCode = newReferralCode._id;
        await newReferralCode.save();
        await contributor.save();
        return res.status(200).send(contributor);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Server error.");
    }
};
exports.purchaseTokens = purchaseTokens;
//# sourceMappingURL=contribute.js.map