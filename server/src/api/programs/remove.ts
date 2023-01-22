const router = require('express').Router();
import ProgramTemplates from '../../collections/program-templates';
import ProgramTemplateWorkouts from '../../collections/program-template-workouts';
import ProgramTemplateExercises from '../../collections/program-template-exercises';
import ProgramTemplateHealthData from '../../collections/program-template-health-data';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { programUid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(programUid)) return res.status(400).send('Invalid workout id');

    try {
        //remove workout
        const program = await ProgramTemplates.findOneAndDelete({ _id: programUid, userUid: uid })
        if (!program) return res.status(404).send("Program doesn't exists.")
        await ProgramTemplateWorkouts.deleteMany({ programTemplateUid: program._id })
        await ProgramTemplateExercises.deleteMany({ programTemplateUid: program._id })
        await ProgramTemplateHealthData.deleteMany({ programTemplateUid: program._id })

        res.send("Program successfully removed.")
    } catch (err) {
        errorCatch(err, res, next);
    }
})

export default router;