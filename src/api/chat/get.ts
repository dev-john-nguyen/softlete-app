const router = require('express').Router();
import Chat from '../../collections/chat';
import errorCatch from '../../utils/error-catch';

//This route allows user to initiate workout W/O exercises
router.get('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    Chat.find({ users: uid })
        .then((docs) => {
            res.send(docs)
        })
        .catch((err) => errorCatch(err, res, next))
})

export default router;