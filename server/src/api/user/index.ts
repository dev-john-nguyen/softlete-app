const router = require('express').Router();
import update from './update';
import get from './get';
import authenticate from '../../utils/authenticate';
import friendsRoutes from './friends';
import block from './block';
import unblock from './unblock';
import deactivate from './deactivate';

router.use(authenticate);
router.use('/update', update);
router.use('/get', get);
router.use('/friends', friendsRoutes);
router.use('/block', block);
router.use('/unblock', unblock);
router.use('/deactivate', deactivate);

export default router;