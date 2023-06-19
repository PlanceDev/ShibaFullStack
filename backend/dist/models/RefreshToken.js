"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
        default: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
}, {
    timestamps: true,
});
refreshTokenSchema.statics.createRefreshToken = async function (data) {
    const refreshToken = await this.create({
        user: data.user,
        token: data.token,
    });
    return refreshToken;
};
refreshTokenSchema.statics.deleteRefreshToken = async function (data) {
    const refreshToken = await this.findOneAndDelete({
        token: data.token,
    });
    return refreshToken;
};
const RefreshToken = (0, mongoose_1.model)("RefreshToken", refreshTokenSchema);
exports.default = RefreshToken;
//# sourceMappingURL=RefreshToken.js.map