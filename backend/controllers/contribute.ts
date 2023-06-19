import e, { Request, Response } from "express";
import User from "../models/User";
import ReferralCode from "../models/ReferralCode";
import jwt from "jsonwebtoken";

// @route   POST api/contribute/
// @desc    Purchase tokens
// @access  Public
export const purchaseTokens = async (req: Request, res: Response) => {
  try {
    if (!req.body.address) {
      return res.status(400).send("No address provided.");
    }

    let contributor = await User.findOne({ publicKey: req.body.address });

    if (!contributor) {
      return res.status(400).send("No contributor found.");
    }

    const accessToken = req.headers.cookie?.split("=")[1] || "";

    if (accessToken) {
      const decodedToken: any = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET || "",
        (error: any, decoded: any) => {
          if (error) {
            return null;
          } else {
            return decoded;
          }
        }
      );

      if (decodedToken) {
        const referrer = await User.findOne({
          isAffiliate: true,
          referralCode: decodedToken._id,
        });

        if (referrer?.publicKey === req.body.address) {
          return;
        }

        if (referrer && !referrer.referrals?.includes(req.body.address)) {
          referrer.referrals?.push(req.body.address);
          await referrer.save();
        }
      }
    }

    // Create new referral code
    const newReferralCode = new ReferralCode({
      owner: req.body.address,
    });

    contributor.isAffiliate = true;
    contributor.referralCode = newReferralCode._id;

    await newReferralCode.save();
    await contributor.save();

    return res.status(200).send(contributor);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error.");
  }
};
