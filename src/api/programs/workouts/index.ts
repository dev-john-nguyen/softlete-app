const router = require('express').Router();
import create from './create';
import get from './get';
import remove from './remove';
import duplicate from './duplicate';

import updateRoutes from './update';
import getExercises from './exercises/get';

router.use('/create', create);
router.use('/get', get);
router.use('/remove', remove);
router.use('/duplicate', duplicate);

router.use('/exercises/get', getExercises);
router.use('/update', updateRoutes)

export default router;