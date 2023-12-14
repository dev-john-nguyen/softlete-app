const router = require('express').Router();
import upload from './upload';
import remove from './remove';
import authenticate from '../../utils/authenticate';

router.use(authenticate);
router.use('/upload', upload);
router.use('/remove', remove);

export default router;