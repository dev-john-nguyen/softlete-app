const router = require('express').Router();
import Chat from '../../../collections/chat';
import Message from '../../../collections/messages';
import errorCatch from '../../../utils/error-catch';
import socketInstances from '../../../sockets/instances';
import mongoose from 'mongoose';
import sendBatchNotification from '../../../utils/notifications/send-batch';
import Users, { profileFilter } from '../../../collections/users';
import _ from 'lodash';
import { NotificationTypes } from '../../../collections/notifications';

//This route allows user to initiate workout W/O exercises
router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    if (!req.body) return res.status(400).send('Invalid request');

    const io = req.app.get('socketio');

    const { chatId, message } = req.body;

    if (!chatId || !message) return res.status(400).send('Empty request');

    if (!mongoose.Types.ObjectId.isValid(chatId)) return res.status(400).send('Invalid id with request');

    //get or validate

    const chatDoc = await Chat.findById(chatId)

    if (!chatDoc) return res.status(404).send('Chat does not exists.');

    const newMessage = new Message({
        chatId: chatDoc._id,
        sender: uid,
        message: message
    })

    newMessage.save()
        .then(async (doc) => {

            chatDoc.recentMsg = doc.message;
            chatDoc.recentUser = doc.sender;
            chatDoc.recentTime = doc.createdAt;
            chatDoc.read = false;

            await chatDoc.save();

            const chatObj = {
                chat: chatDoc.toObject(),
                message: doc.toObject()
            }

            //send headers
            res.send(chatObj)

            //future might implement group chat
            const otherUids: string[] = [];

            chatDoc.users.forEach(id => {
                if (id === uid) return;
                otherUids.push(id)
            })

            if (otherUids.length > 0) {
                otherUids.forEach(id => {
                    const socketId = socketInstances[id]?.socketId;
                    if (socketId) io.to(socketId).emit('message', chatObj)
                })

                handleNotification(otherUids, uid, doc.message, chatDoc._id.toString())
                    .catch(err => console.log(err))
            }

        })
        .catch((err) => errorCatch(err, res, next))


})

async function handleNotification(uids: string[], uid: string, message: string, chatId: string) {
    const sender = await Users.findOne({ uid: uid }).select(profileFilter);
    if (sender) {
        const senderProps = sender.toObject() as any;
        const title = sender.username;
        const body = message.slice(0, 100);
        sendBatchNotification(uids, title, body, { senderProps: JSON.stringify(senderProps), notificationType: NotificationTypes.NEW_MESSAGE, chatId })
    }
}

export default router;