const router = require('express').Router();
import create from './create';
import update from './update';
import remove from './remove';
import fetchAll from './fetch-all';

router.use('/create', create);
router.use('/update', update);
router.use('/remove', remove);
router.use('/fetch-all', fetchAll);



export default router;