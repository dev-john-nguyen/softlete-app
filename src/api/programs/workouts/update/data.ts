const router = require('express').Router();
import ProgramTemplateExercises from '../../../../collections/program-template-exercises';
import { isInvalidExerciseData } from '../../../../utils/validations';
import mongoose from 'mongoose';
import { WorkoutExerciseDataProps } from '../../../../collections/workout-exercises';
import errorCatch from '../../../../utils/error-catch';

interface BodyProps {
    _id: mongoose.Types.ObjectId;
    data: WorkoutExerciseDataProps[];
    calcRef: any;
}

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    //_id is the workout-exercise _id;
    const {
        dataArr
    } = req.body as { dataArr: BodyProps[] };

    //loop through data and validate everything
    if (!dataArr || dataArr.length < 1) return res.status(400).send("No data found with request");

    //create a batch
    const updateBatch = [];

    for (let i = 0; i < dataArr.length; i++) {
        const { data, _id, calcRef } = dataArr[i];
        //workout template will not have dates associated with it. Frequency will be applied
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid exercise id');

        if (isInvalidExerciseData(data, true)) return res.status(400).send("Invalid data associated with request");

        let calcInt = 0;

        if (calcRef) calcInt = parseFloat(calcRef) ? parseFloat(calcRef) : 0

        updateBatch.push({
            updateOne: {
                filter: { _id },
                update: { data, calcRef: calcInt }
            }
        })
    }

    if (updateBatch.length < 1) return res.send('No exercises updated.')

    ProgramTemplateExercises.bulkWrite(updateBatch)
        .then((batch) => {
            res.send(`${batch.modifiedCount} successfully updated.`)
        })
        .catch((err) => errorCatch(err, res, next))

})

export default router;