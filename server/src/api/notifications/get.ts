const router = require('express').Router();
import Notifications from '../../collections/notifications';
import errorCatch from '../../utils/error-catch';

router.get('/', async (req: any, res: any, next: any) => {
    //fetch the last months notifications???
    const { uid } = req.headers;
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    Notifications.find({ uid, date: { $gte: startDate, $lte: endDate } }).sort({ date: 'descending' }).limit(30)
        .then((docs) => {
            res.send(docs)
        })
        .catch((err) => errorCatch(err, res, next))
})

export default router;