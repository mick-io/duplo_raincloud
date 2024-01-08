import mongoose, { Schema } from "mongoose";

import { LocationDocument } from "../../types/database";

const locationSchema: Schema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const LocationModel = mongoose.model<LocationDocument>(
  "Location",
  locationSchema,
);
export default LocationModel;
