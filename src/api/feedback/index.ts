const router = require('express').Router();
import feedback from './feedback';
import contact from './contact';

router.use('/contact', contact);
router.use('/', feedback);

export default router;