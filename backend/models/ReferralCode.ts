import { v4 as uuidv4 } from "uuid";
import { Model, model, Schema, Document } from "mongoose";

export interface IReferralCode extends Document {
  _id: string;
  owner: string;
  createdAt?: Date;
}

const referralSchema = new Schema<IReferralCode>(
  {
    _id: {
      type: String,
      default: uuidv4,
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
  },
  {
    timestamps: true,
  }
);

const ReferralCode = model<IReferralCode>("ReferralCode", referralSchema);

export default ReferralCode;
