import mongoose from "mongoose";
import Users from '../../../collections/users';
import errorCatch from "../../../utils/error-catch";
const router = require('express').Router();
import _ from 'lodash';


router.post('/', (req: any, res: any, next: any) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    const { notificationToken } = req.body as { notificationToken: string }

    if (!notificationToken || typeof notificationToken !== 'string') return res.status(401).send("Token is empty.")

    Users.findOneAndUpdate({ uid: uid }, { notificationToken }, { new: true })
        .then(() => res.send())
        .catch((err) => errorCatch(err, res, next))
})


export default router;