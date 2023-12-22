import mongoose, { Schema } from "mongoose";

export interface ILocation {
  latitude: number;
  longitude: number;
}

const locationSchema: Schema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

export default mongoose.model<ILocation>("Location", locationSchema);
