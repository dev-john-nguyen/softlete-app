import { Request, Response } from 'express';

export const routeErrorWrapper =
  (fn: any) => async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Oops! Something went wrong!');
    }
  };
