import { v4 as uuidv4 } from 'uuid';
import { Model, model, Schema, Document, ObjectId } from 'mongoose';

export interface IImage extends Document {
  imageId: string;
  prompt: string;
  imageData: string;
  createdAt: Date;
}

export interface IImageModel extends Model<IImage> {
  saveImage: (data: IImage) => Promise<IImage>;
  getImages: () => Promise<IImage>;
}

const imageSchema = new Schema<IImage, IImageModel>(
  {
    imageId: {
      type: String,
      default: uuidv4,
    },
    prompt: {
      type: String,
    },
    imageData: {
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

imageSchema.statics.createImage = async function (
  data: IImage
): Promise<IImage> {
  try {
    const image = await this.create({
      prompt: data.prompt,
      imageData: data.imageData,
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

const Image = model<IImage, IImageModel>('Image', imageSchema);

export default Image;
