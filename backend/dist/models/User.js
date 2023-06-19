"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
        unique: true,
    },
    isAffiliate: {
        type: Boolean,
        default: false,
    },
    referralCode: {
        type: String,
        default: "",
        ref: "ReferralCode",
    },
    referrals: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_, ret) => {
            delete ret.__v;
        },
    },
});
userSchema.statics.createUser = async function (data) {
    try {
        const user = await this.create({
            publicKey: data.publicKey,
            createdAt: data.createdAt,
        });
        return user;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
userSchema.statics.getUser = async function (id) {
    try {
        const user = await this.findOne({ id: id });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map