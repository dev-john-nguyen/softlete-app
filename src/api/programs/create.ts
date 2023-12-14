const router = require('express').Router();
import mongoose from 'mongoose';
import ProgramTemplate from '../../collections/program-templates';
import { isEmptyObj } from '../../utils/validations';
import errorCatch from '../../utils/error-catch';

//initiate program
//workouts are add via a different route

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request');

    const { name, description, isPrivate } = req.body;

    const programData = {
        name,
        description,
        isPrivate
    }

    if (isEmptyObj(programData)) return res.status(401).send('Invalid data associated with request.')

    if (typeof isPrivate !== 'boolean') return res.status(401).send('Invalid data associated with request.')

    const newProgramTemplate = new ProgramTemplate({
        ...programData,
        userUid: uid
    });

    newProgramTemplate.save()
        .then((doc) => res.send(doc.toObject()))
        .catch((err) => errorCatch(err, res, next))
})

export default router;