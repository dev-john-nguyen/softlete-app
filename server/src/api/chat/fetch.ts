const router = require('express').Router();
import Chat from '../../collections/chat';
import Message from '../../collections/messages';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';

//This route allows user to initiate workout W/O exercises
router.get('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid, } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { userUid, chatId } = req.query;

    if (!userUid && !chatId) return res.status(400).send('Empty request');

    if (userUid && typeof userUid !== 'string') return res.status(400).send("Invalid id associated with request.")

    if (chatId && !mongoose.Types.ObjectId.isValid(chatId)) return res.status(400).send("Invalid id associated with request.")


    try {

        const query = chatId ? { _id: chatId } : { users: { $all: [uid, userUid] } }

        const chatDoc = await Chat.findOne(query);

        if (!chatDoc) return res.send()

        chatDoc.read = true;

        await chatDoc.save();

        const messages = await Message.find({ chatId: chatDoc.id });

        res.send({
            ...chatDoc.toObject(),
            messages: messages
        })

    } catch (err) {
        return errorCatch(err, res, next)
    }
})

export default router;