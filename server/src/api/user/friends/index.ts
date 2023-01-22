const router = require('express').Router();
import getFriends from './get-friends';
import update from './update';
import getRequests from './get-requests';

router.use('/get/all', getRequests);
router.use('/get/friends', getFriends);
router.use('/update', update);

export default router;