const router = require('express').Router();
import header from './header';

router.use('/header', header);

export default router;