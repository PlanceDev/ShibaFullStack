"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", true);
mongoose_1.default.set("strict", true);
mongoose_1.default.set("runValidators", true);
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI || "")
    .then(() => {
    console.log("Mongo DB Connected");
})
    .catch((e) => {
    console.log(e);
});
//# sourceMappingURL=index.js.map