const router = require('express').Router();
import apicache from 'apicache';
import Users from '../../collections/users';
const cache = apicache.middleware;

const softleteEmail = 'admin@softlete.com'

const onlyStatus200 = (req: any, res: any) => res.statusCode === 200

const cacheSuccesses = cache('24 hour', onlyStatus200)

router.get('/', cacheSuccesses, async (req: any, res: any) => {
    Users.findOne({ email: softleteEmail })
        .then((doc) => {
            if (doc) {
                res.send(doc.uid)
            } else {
                res.send('')
            }
        })
        .catch((err) => {
            console.log(err)
            res.send('')
        })
})

export default router;