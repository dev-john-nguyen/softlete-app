const router = require('express').Router();
import register from './register';
import signin from './signin';
import authenticate from '../../utils/authenticate';

router.use(authenticate);
router.use('/register', register);
router.use('/login', signin);

export default router;