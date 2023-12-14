const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import get from './get';
import update from './update';

router.use(authenticate);
router.use('/get', get);
router.use('/update', update);

export default router;