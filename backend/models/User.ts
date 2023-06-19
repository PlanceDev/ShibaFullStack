import { v4 as uuidv4 } from "uuid";
import { Model, model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  id?: string;
  publicKey: string;
  isAffiliate?: boolean;
  referralCode?: string;
  referrals?: string[];
  createdAt?: Date;
}

export interface IUserModel extends Model<IUser> {
  createUser: (data: { publicKey: string; createdAt?: Date }) => Promise<IUser>;
  getUser: (user: string) => Promise<IUser>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    _id: {
      type: String,
      default: uuidv4,
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
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.createUser = async function (data: IUser): Promise<IUser> {
  try {
    const user = await this.create({
      publicKey: data.publicKey,
      createdAt: data.createdAt,
    });

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

userSchema.statics.getUser = async function (id: string): Promise<IUser> {
  try {
    const user = await this.findOne({ id: id });

    if (!user) throw new Error("User not found");

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
