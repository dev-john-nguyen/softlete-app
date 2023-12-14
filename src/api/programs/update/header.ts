const router = require('express').Router();
import ProgramTemplate from '../../../collections/program-templates';
import { isEmptyObj, validUri } from '../../../utils/validations';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request');

    const { name, description, isPrivate, imageUri, _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(401).send("Invalid program id.")

    const updatedHeader = {
        name,
        description,
        isPrivate
    } as { name: string, description: string, isPrivate: boolean, imageUri?: string }


    if (isEmptyObj(updatedHeader)) return res.status(401).send('Invalid data associated with request.')

    if (typeof isPrivate !== 'boolean') return res.status(401).send('Invalid data associated with request.')

    if (imageUri) {
        //validate
        if (typeof imageUri !== 'string' || !validUri(imageUri)) return res.status(401).send('Invalid image');

        updatedHeader.imageUri = imageUri;
    }

    ProgramTemplate.findOneAndUpdate({ _id: _id, userUid: uid }, updatedHeader, { new: true })
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject())
            } else {
                res.status(500).send("Failed to update program. Please try again.")
            }
        })
        .catch((err) => errorCatch(err, res, next))
})

export default router;