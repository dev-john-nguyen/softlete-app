const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import get from './get';

router.use(authenticate);
router.use('/get', get);

export default router;