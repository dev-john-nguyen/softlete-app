const router = require('express').Router();
import images from './images';
import healthData from './health-data';

router.use('/images', images);
router.use('/health-data', healthData);

export default router;