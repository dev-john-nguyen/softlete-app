const router = require('express').Router();
import Users from '../../collections/users';
import Friends from '../../collections/friends';
import errorCatch from "../../utils/error-catch";
import Chat from '../../collections/chat';
import Notifications from '../../collections/notifications';
import admin from 'firebase-admin';
//remove all the account data

router.post('/', async (req: any, res: any, next: any) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send("cannot find user id.")

    try {
        await admin.auth().deleteUser(uid)
        const user = await Users.findOneAndDelete({ uid: uid })
        if (!user) return res.status(404).send("Couldn't find your account. Please try again.");
        //remove friends
        Friends.deleteMany({ users: { $in: [uid] } }).catch((err) => console.log(err));
        Chat.deleteMany({ users: { $in: [uid] } }).catch((err) => console.log(err));
        Notifications.deleteMany({ uid: uid }).catch((err) => console.log(err));

        res.send("Account successfully removed!")
    } catch (err) {
        console.log(err);
        errorCatch(err, res, next)
    }
})

export default router;