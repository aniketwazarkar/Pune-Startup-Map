import mongoose from "mongoose";

const { Schema, model } = mongoose;

const startupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Startup", "VC"], required: true },
    stage: { type: String, required: true, trim: true },
    sector: { type: String, required: true, trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    blurb: { type: String, required: true, trim: true },
    founded: { type: String, trim: true },
    founders: { type: String, trim: true },
    website: { type: String, trim: true },
    status: { type: String, enum: ["approved", "pending"], default: "pending", required: true },
  },
  { timestamps: true }
);

export const Startup = model("Startup", startupSchema);
