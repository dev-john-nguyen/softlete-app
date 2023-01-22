const router = require('express').Router();
import apicache from 'apicache';
const cache = apicache.middleware;
import MusclesGroups from '../../collections/muscle-groups';
import errorCatch from '../../utils/error-catch';
import Equipments from '../../collections/equipments';

const onlyStatus200 = (req: any, res: any) => res.statusCode === 200

const cacheSuccesses = cache('24 hour', onlyStatus200)

router.get('/', cacheSuccesses, async (req: any, res: any, next: any) => {
    try {

        const muscleGroups = await MusclesGroups.find().select({ name: 1 })
        const equipments = await Equipments.find().select({ name: 1 })

        res.send({
            muscleGroups: muscleGroups.map(m => m.name),
            equipments: equipments.map(e => e.name)
        })

    } catch (err) {
        errorCatch(err, res, next)
    }
})

export default router;