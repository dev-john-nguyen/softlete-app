const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import create from './create';
import remove from './remove';
import get from './get';
import update from './update';
import generate from './generate';
import like from './like';
import removeExercise from './remove/exercise';
import workoutsRoutes from './workouts';

import generatedRoutes from './generated';

import accessRoutes from './access';

router.use(authenticate);

router.use('/generate', generate)
router.use('/create', create);
router.use('/get', get);
router.use('/like', like);

router.use('/remove/exercise', removeExercise);
router.use('/remove', remove);
router.use('/update', update);

router.use('/workouts', workoutsRoutes)

router.use('/generated', generatedRoutes);

router.use('/access', accessRoutes)


export default router;