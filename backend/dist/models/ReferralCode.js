"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const mongoose_1 = require("mongoose");
const referralSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const ReferralCode = (0, mongoose_1.model)("ReferralCode", referralSchema);
exports.default = ReferralCode;
//# sourceMappingURL=ReferralCode.js.map