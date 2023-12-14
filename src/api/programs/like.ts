const router = require('express').Router();
import ProgramTemplates, { ProgramTemplateProps } from '../../collections/program-templates';
import Users from '../../collections/users';
import { NotificationTypes } from '../../collections/notifications';
import { Types } from 'mongoose';
import errorCatch from '../../utils/error-catch';
import sendSingleNotification from '../../utils/notifications/send-single';
import { profileFilter } from '../../collections/users';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { programUid } = req.body as { programUid: string };

    if (!programUid || !Types.ObjectId.isValid(programUid)) return res.status(400).send("Invalid program tempalte id.")

    ProgramTemplates.findOneAndUpdate({ _id: programUid, likeUids: { $ne: uid } }, { $push: { likeUids: uid } })
        .then((doc) => {
            if (doc) {
                res.send('like')
                sendNotification(doc.toObject(), doc.userUid, uid).catch(err => console.log(err))
            } else {
                res.send()
            }
        })
        .catch((err) => errorCatch(err, res, next))
})


async function sendNotification(program: ProgramTemplateProps, receiverUid: string, senderUid: string) {

    const sender = await Users.findOne({ uid: senderUid }).select(profileFilter)

    if (sender) {
        const title = '';
        const body = `${sender.username} liked your ${program.name} program.`
        const senderProps = sender.toObject() as any

        sendSingleNotification(receiverUid, title, body, { senderProps: JSON.stringify(senderProps), notificationType: NotificationTypes.LIKE_PROGRAM, programUid: program._id ? program._id.toString() : '' }, NotificationTypes.LIKE_PROGRAM)
    }
}

export default router;