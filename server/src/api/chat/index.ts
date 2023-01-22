const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import create from './create';
import fetch from './fetch';
import get from './get';
import remove from './remove';
import messagesRoute from './messages';

router.use(authenticate);
router.use('/create', create);
router.use('/fetch', fetch);
router.use('/get', get);
router.use('/messages', messagesRoute);
router.use('/remove', remove)

export default router;