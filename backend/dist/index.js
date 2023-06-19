"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db");
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const originList = [process.env.PRODUCTION_URL];
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 60, // limit each IP to 60 requests per minute
});
app.use((0, cors_1.default)({
    origin: originList || "http://127.0.0.1:3000",
    credentials: true,
}));
// app.use(helmet());
app.use(body_parser_1.default.urlencoded({ extended: true })); // Must be placed above mongoSanitize for mongoSanitize to work
app.use(body_parser_1.default.json({ limit: "10mb" })); // Must be placed above mongoSanitize for mongoSanitize to work
app.use((0, express_mongo_sanitize_1.default)()); // Data sanitization against NoSQL query injection
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Routes
const user_1 = __importDefault(require("./routes/user"));
const referral_1 = __importDefault(require("./routes/referral"));
const contribute_1 = __importDefault(require("./routes/contribute"));
// Route Middlewares
app.use("/api/user", rateLimiter, user_1.default);
app.use("/api/referral", rateLimiter, referral_1.default);
app.use("/api/contribute", rateLimiter, contribute_1.default);
// Redirect http to https and remove www from url
if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
        var _a, _b;
        // redirect http to https
        if (req.header("x-forwarded-proto") !== "https")
            return res.redirect(`https://${req.header("host")}${req.url}`);
        // replace www with non-www
        if ((_a = req.header("host")) === null || _a === void 0 ? void 0 : _a.startsWith("www.")) {
            return res.redirect(301, `https://${(_b = req.header("host")) === null || _b === void 0 ? void 0 : _b.replace("www.", "")}${req.url}`);
        }
        next();
    });
}
// Point the server to the build folder of the app
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "../../client", "build", "index.html"));
    });
}
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map