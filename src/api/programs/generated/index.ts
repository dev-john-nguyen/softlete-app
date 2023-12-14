const router = require('express').Router();
import get from './get';
import remove from './remove';

router.use('/get', get)
router.use('/remove', remove);


export default router;