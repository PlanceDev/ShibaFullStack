import { v4 as uuidv4 } from 'uuid';
import { Model, model, Schema, Document } from 'mongoose';

export interface IImage extends Document {
  id?: string;
  name: string;
  image: string;
  createdAt?: Date;
}

export interface IImageModel extends Model<IImage> {
  saveImage: (data: IImage) => Promise<IImage>;
  getImages: () => Promise<IImage>;
}

const imageSchema = new Schema<IImage, IImageModel>(
  {
    id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
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

imageSchema.statics.saveImage = async function (data: IImage): Promise<IImage> {
  try {
    const image = await this.create({
      name: data.name,
      image: data.image,
      createdAt: data.createdAt,
    });

    return image;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

imageSchema.statics.getImages = async function (): Promise<IImage[]> {
  try {
    const images = await this.find({});

    return images;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const User = model<IImage, IImageModel>('Image', imageSchema);

export default User;
