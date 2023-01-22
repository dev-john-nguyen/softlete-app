const router = require('express').Router();
import exVid from './ex-vid';
import woImg from './wo-img';

router.use('/wo/img', exVid);
router.use('/ex/vid', woImg);

export default router;