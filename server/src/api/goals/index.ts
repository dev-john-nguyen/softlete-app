const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import update_exercise from './update-exercise';
import get from './get';

router.use(authenticate);
router.use('/update-exercise', update_exercise);
router.use('/get', get);

export default router;
