const router = require('express').Router();

import send from './send';

router.use('/send', send)


export default router;