import {injectable} from "tsyringe";
import {CacheEntry, CacheEntryDocument} from "../models";
import to from 'await-to-js';
import {CACHE_TTL} from "../util/secrets";
import {getExpiryDate, getRandomData} from "../util";
import logger from "../util/logger";

@injectable()
export class CacheService {
    private readonly ttl: number = CACHE_TTL;

    constructor() {
    }

    public async findByKey(key: string): Promise<CacheEntryDocument> {
        let cacheEntry = await CacheEntry.findOne({key});

        if (cacheEntry) {
            logger.log('info', "Cache hit");
            if (new Date(cacheEntry.expiryDate) < new Date()) {
                cacheEntry.value = getRandomData();
            }
            cacheEntry = await this.updateExpireDate(cacheEntry);
            return cacheEntry;
        } else {
            logger.log('info', "Cache miss");
            let cacheDoc = {
                key,
                ttl: this.ttl,
                expiryDate: getExpiryDate(this.ttl),
                value: getRandomData()
            };
            let docs = await CacheEntry.create([cacheDoc]);
            if (docs && docs.length) {
                return docs[0];
            }
        }
    }
    public async updateByKey(key: string, value: any): Promise<CacheEntryDocument> {
        let res = await CacheEntry.findOneAndUpdate({ key },{value, expiryDate: getExpiryDate(this.ttl)});
        return  res;
    }
    public async removeByKey(key: string): Promise<CacheEntryDocument> {
        let res = await CacheEntry.findOneAndDelete({ key });
        return  res;
    }
    public async findAllKeys(): Promise<string[]> {
        let cacheEntries = await CacheEntry.find({},{key:1}).lean();
        return cacheEntries.map((e: CacheEntryDocument) =>e.key);
    }

    protected async updateExpireDate(cacheEntry: CacheEntryDocument): Promise<CacheEntryDocument> {
        cacheEntry.expiryDate = getExpiryDate(this.ttl);
        return cacheEntry.save();
    }
}