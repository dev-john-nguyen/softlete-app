const router = require('express').Router();
import subscribe from './subscribe';

router.use('/subscribe', subscribe)

export default router;