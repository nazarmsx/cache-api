"use strict";
import * as express from 'express'
const router: express.Router = express.Router();
import {check, sanitize, validationResult} from "express-validator";
import to from 'await-to-js';
import {CacheEntry} from "../models";
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

router.put('/api/v1/cache', async function (req: Request, res: Response, next: NextFunction) {
    const key=req.body.key;
    const value=req.body.value;
    let entry=await cacheService.updateByKey(key,value);
    if(!entry){
        return res.status(404).json({error:"CACHE_ENTRY_NOT_FOUND"})
    }
    res.json({status:"OK",data:entry})
});

router.delete('/api/v1/cache/:key', async function (req: Request, res: Response, next: NextFunction) {
    const key=req.params.key;
    let entry=await cacheService.removeByKey(key);
    if(!entry){
        return res.status(404).json({error:"CACHE_ENTRY_NOT_FOUND"})
    }
    res.json({status:"OK",message:"Cache entry successfully deleted."})
});

export {router};