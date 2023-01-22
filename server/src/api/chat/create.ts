const router = require('express').Router();
import Chat from '../../collections/chat';
import Message from '../../collections/messages';
import errorCatch from '../../utils/error-catch';
import socketInstances from '../../sockets/instances';
import Users, { profileFilter } from '../../collections/users';
import sendSingleNotification from '../../utils/notifications/send-single';
import sendBatchNotification from '../../utils/notifications/send-batch';
import { NotificationTypes } from '../../collections/notifications';

//This route allows user to initiate workout W/O exercises
router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    if (!req.body) return res.status(400).send('Invalid request');

    const { userUid, message } = req.body;

    if (!userUid) return res.status(400).send('Empty request');

    if (typeof userUid !== 'string') return res.status(400).send("Invalid id associated with request.")

    if (message) {
        //validate message
        if (typeof message !== 'string') return res.status(400).send('Invalid message request');
    }

    const newChat = new Chat({
        users: [uid, userUid],
        owner: uid
    })

    try {
        await newChat.save()
    } catch (err) {
        console.log(err);
        return errorCatch(err, res, next)
    }


    //there doesn't have to be a message. A user can init a convo with another user
    if (!message) return res.send({ chat: newChat.toObject() })


    const newMessage = new Message({
        chatId: newChat._id,
        sender: uid,
        message: message
    })

    const io = req.app.get('socketio');

    newMessage.save()
        .then(async (doc) => {

            newChat.recentMsg = doc.message;
            newChat.recentUser = doc.sender;
            newChat.read = false;

            await newChat.save();

            //future might implement group chat
            const otherUids: string[] = [];

            newChat.users.forEach(id => {
                if (id === uid) return;
                otherUids.push(id)
            })

            if (otherUids.length > 0) {
                otherUids.forEach(id => {
                    const socketId = socketInstances[id]?.socketId;
                    if (socketId) io.to(socketId).emit('message', doc.toObject())
                })

                handleNotification(otherUids, uid, doc.message, newChat._id.toString())
                    .catch(err => console.log(err))
            }

            res.send({
                chat: newChat.toObject(),
                message: doc.toObject()
            })
        })
        .catch((err) => errorCatch(err, res, next))
})

async function handleNotification(uids: string[], uid: string, message: string, chatId: string) {
    const sender = await Users.findOne({ uid: uid }).select(profileFilter);
    if (sender) {
        const senderProps = sender.toObject() as any;
        const title = sender.username;
        const body = message.slice(0, 100);
        sendBatchNotification(uids, title, body, { senderProps: JSON.stringify(senderProps), notificationType: NotificationTypes.NEW_MESSAGE, chatId: chatId })
    }
}

export default router;