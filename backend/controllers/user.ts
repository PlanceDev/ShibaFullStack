import e, { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

// @route   POST api/user/
// @desc    Login a user
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    if (!req.body.address) {
      return res.status(400).send("Please provide an address.");
    }

    let user = await User.findOne({ publicKey: req.body.address });

    if (!user) {
      user = new User({
        publicKey: req.body.address,
      });

      await user.save();
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error.");
  }
};
