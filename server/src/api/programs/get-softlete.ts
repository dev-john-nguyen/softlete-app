const router = require('express').Router();
import ProgramTemplates from '../../collections/program-templates';
import errorCatch from '../../utils/error-catch';
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../utils/cache-only-non-owner';
import { NextFunction, Request, Response } from 'express';
const cache = apicache.middleware;

/*
    Fetch all programs created by admins / softletes
*/

router.get(
  '/',
  cache('1 hour', cacheOnlyNonOwner),
  (req: Request, res: Response, next: NextFunction) => {
    ProgramTemplates.find({ isSoftlete: true }, (err: any, docs: any) => {
      if (err) return errorCatch(err, res, next);
      if (docs.length < 1) return res.send([]);
      res.send(docs);
    });
  },
);

export default router;
