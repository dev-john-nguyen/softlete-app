const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import create from './create';

router.use(authenticate);
router.use('/create/', create);

export default router;