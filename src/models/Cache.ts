import mongoose from "mongoose";
import {MAX_CACHE_ENTRIES} from "../util/secrets";

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
  expiryDate: {type: Date, index: true}
});

export const CacheEntry = mongoose.model<CacheEntryDocument>("cache_entries", cacheEntrySchema);
