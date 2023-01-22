const router = require('express').Router();
import data from './data';
import exercises from './exercises';
import header from './header';
import healthData from './health-data';

router.use('/header', header);
router.use('/exercises', exercises);
router.use('/data', data);
router.use('/health-data', healthData);

export default router;