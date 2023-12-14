const router = require('express').Router();
import Chat from '../../collections/chat';
import Message from '../../collections/messages';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';
import socketInstances from '../../sockets/instances';
//This route allows user to initiate workout W/O exercises
router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;
    const io = req.app.get('socketio');

    if (!uid) return res.status(401).send("cannot find user id.");

    if (!req.body) return res.status(400).send('Invalid request');

    const { chatId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(chatId)) return res.status(401).send("Invalid chat");

    try {
        const chat = await Chat.findOneAndDelete({ _id: chatId, users: { $in: uid } })
        if (!chat) return res.status(404).send('Chat not found.')
        await Message.deleteMany({ chatId: chat._id })
        //send live update if available
        // send it to the other user
        chat.users.forEach(id => {
            if (id === uid) return;
            const socketId = socketInstances[id]?.socketId;
            if (socketId) {
                io.to(socketId).emit('remove-chat', { chatId: chat._id })
            }
        })

        res.send()
    } catch (err) {
        errorCatch(err, res, next)
    }
})

export default router;