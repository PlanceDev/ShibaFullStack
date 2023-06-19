import { v4 as uuidv4 } from "uuid";
import { Model, model, Schema, Document } from "mongoose";

export interface RefreshToken extends Document {
  _id: string;
  token: string;
  user: string;
  createdAt?: Date;
  expires?: Date;
}

export interface RefreshTokenModel extends Model<RefreshToken> {
  createRefreshToken: (data: {
    token: string;
    user: string;
  }) => Promise<RefreshToken>;

  deleteRefreshToken: (data: { token: string }) => Promise<RefreshToken>;
}

const refreshTokenSchema = new Schema<RefreshToken, RefreshTokenModel>(
  {
    _id: {
      type: String,
      default: uuidv4,
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
  },
  {
    timestamps: true,
  }
);

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

const RefreshToken = model<RefreshToken, RefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
