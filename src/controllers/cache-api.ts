"use strict";
import * as express from 'express'
const router: express.Router = express.Router();
import {check, sanitize, validationResult} from "express-validator";
import {container} from "tsyringe";
import {CacheService} from "../services"
const cacheService = container.resolve(CacheService);
import { Response, Request, NextFunction } from "express";

router.get('/api/v1/cache/:key', async function (req: Request, res: Response, next: NextFunction) {
    const key=req.params.key;
    let entry=await cacheService.findByKey(key);
    res.json({status:"OK",data:entry})
});

router.get('/api/v1/keys', async function (req: Request, res: Response, next: NextFunction) {
    let keys=await cacheService.findAllKeys();
    res.json({status:"OK",data:keys})
});

async function updateCacheEntry(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error: "BAD_PARAMETERS", errors: errors.array()});
    }
    const key=req.body.key;
    const value=req.body.value;
    let entry=await cacheService.updateByKey(key,value);
     if(!entry){
        return res.status(404).json({error:"CACHE_ENTRY_NOT_FOUND"})
    }
    res.json({status:"OK",data:entry})
}

router.put('/api/v1/cache',
    [check("key", "key is required").not().isEmpty(),
        check("value", "value is required").not().isEmpty(),
    ], updateCacheEntry);

router.delete('/api/v1/cache/:key', async function (req: Request, res: Response, next: NextFunction) {
    const key=req.params.key;
    let entry=await cacheService.removeByKey(key);
    if(!entry){
        return res.status(404).json({error:"CACHE_ENTRY_NOT_FOUND"})
    }
    res.json({status:"OK",message:"Cache entry successfully deleted."})
});

router.delete('/api/v1/cache-clear', async function (req: Request, res: Response, next: NextFunction) {
    const key=req.params.key;
    let deletionResults=await cacheService.clearCache();
    res.json({status:"OK",message:"Cache cleared."})
});

export {router};