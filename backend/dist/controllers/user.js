"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const User_1 = __importDefault(require("../models/User"));
// @route   POST api/user/
// @desc    Login a user
// @access  Public
const loginUser = async (req, res) => {
    try {
        let user = await User_1.default.findOne({ publicKey: req.body.address });
        if (!user) {
            user = new User_1.default({
                publicKey: req.body.address,
            });
        }
        await user.save();
        // console.log(user);
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Server error.");
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=user.js.map