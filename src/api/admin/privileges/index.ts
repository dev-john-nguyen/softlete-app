const router = require('express').Router();
import setAdmin from './set-admin';

router.use('/set-admin', setAdmin);

export default router;
