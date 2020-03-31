import mongoose from "mongoose";

export type CacheEntryDocument = mongoose.Document & {
  key: string;
  value:Object,
  ttl:Number;
  expiryDate:Date;
};

const cacheEntrySchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: Object,
  ttl:Number,
  expiryDate: Date
});

export const CacheEntry = mongoose.model<CacheEntryDocument>("cache_entries", cacheEntrySchema);
