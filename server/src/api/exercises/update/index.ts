const router = require('express').Router();
import props from './props';
import meas from './meas';

router.use('/props', props);
router.use('/meas', meas);

export default router;