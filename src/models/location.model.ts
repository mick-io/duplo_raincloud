import mongoose, { Document, Schema } from "mongoose";

export interface ILocation extends Document {
  latitude: number;
  longitude: number;
}

const locationSchema: Schema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

export default mongoose.model<ILocation>("Location", locationSchema);
