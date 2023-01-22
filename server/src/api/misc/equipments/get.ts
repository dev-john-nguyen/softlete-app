const router = require('express').Router();
import apicache from 'apicache';
const cache = apicache.middleware;
import Equipments from '../../../collections/equipments';
import errorCatch from '../../../utils/error-catch';

const onlyStatus200 = (req: any, res: any) => res.statusCode === 200

const cacheSuccesses = cache('24 hour', onlyStatus200)

router.get('/', cacheSuccesses, (req: any, res: any, next: any) => {
    Equipments.find().select({ name: 1 })
        .then((docs) => {
            res.send(docs.map(d => d.name))
        })
        .catch(err => errorCatch(err, res, next))
})

export default router;