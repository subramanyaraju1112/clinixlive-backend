import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface PractitionerDocument extends Document {
  practitionerId: string;
  email: string;
  password: string;
  name: string;
  specialization: string;
  isActive: boolean;
  createdAt: Date;
}

const PractionerSchema = new Schema<PractitionerDocument>(
  {
    practitionerId: {
      type: Schema.Types.String,
      default: (): string => uuidv4(),
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<PractitionerDocument>(
  "Practitioner",
  PractionerSchema
);
