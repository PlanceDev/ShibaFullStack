import e, { Request, Response } from "express";
import ReferralCode from "../models/ReferralCode";
import jwt from "jsonwebtoken";

// @route   GET api/referral/:referralId
// @desc    Check if referral exists
// @access  Public
export const checkReferral = async (req: Request, res: Response) => {
  try {
    const referralCode = await ReferralCode.findOne({
      _id: req.params.id,
    });

    if (!referralCode) {
      return res.status(200).send("no-ref");
    }

    const accessToken = jwt.sign(
      {
        _id: referralCode._id,
        referrer: referralCode.owner,
      },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "365d",
      }
    );

    // console.log(accessToken);

    res.cookie("referral", accessToken, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    return res.status(200).send("ref");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error.");
  }
};
