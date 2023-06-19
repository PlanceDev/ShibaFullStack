"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
async function verifyAccessToken(access_token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN_SECRET || "", (error, decoded) => {
            if (error) {
                let err = new Error("Access denied. Invalid token");
                err.name = "TokenExpiredError";
                err.status = 401;
                reject(error);
            }
            else {
                resolve(decoded);
            }
        });
    });
}
async function refreshToken(req, res, access_token) {
    const refresh_token = req.cookies.refresh_token;
    const decodedUser = jsonwebtoken_1.default.decode(access_token);
    const getNewToken = await axios_1.default.post(`${process.env.SERVER_URL}/auth/refresh-token`, {
        refresh_token,
        decodedUser,
    });
    const newAccessToken = getNewToken.data.accessToken;
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    res.header("Access-Control-Expose-Headers", "Authorization");
    req.user = jsonwebtoken_1.default.decode(newAccessToken);
    await verifyAccessToken(newAccessToken);
    return newAccessToken;
}
const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
            return res.status(401).send({ message: "No token provided" });
        }
        const access_token = authHeader.split(" ")[1];
        try {
            const decoded = await verifyAccessToken(access_token);
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                await refreshToken(req, res, access_token);
                next();
            }
            else {
                throw error;
            }
        }
    }
    catch (err) {
        console.log("JWT error", err.message);
        res.status(err.status || 500).send({
            error: "Access denied. Invalid token",
            status: err.status,
        });
    }
};
exports.protectedRoute = protectedRoute;
//# sourceMappingURL=protected.js.map