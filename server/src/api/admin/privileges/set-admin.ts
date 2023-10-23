import express, { Request, Response } from 'express';
import Users from '../../../collections/users';
import admin from 'firebase-admin';
const router = express.Router();

router.post(
  '/create-admin',
  async (req: Request<null, null, { userUid: string }>, res: Response) => {
    try {
      const userUid = req.body.userUid;
      await admin.auth().setCustomUserClaims(userUid, { admin: true });
      await Users.updateOne({ userUid: userUid }, { admin: true });
      res.send('success');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Something went wrong');
    }
  },
);

export default router;
