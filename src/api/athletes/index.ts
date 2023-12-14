const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import search from './search';
import get from './get';
import getBulk from './get-bulk';

router.use(authenticate);

router.use('/search', search);
router.use('/get/bulk', getBulk)
router.use('/get', get);

export default router;