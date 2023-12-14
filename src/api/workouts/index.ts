const router = require('express').Router();
import create from './create';
import get from './get';
// import update from './update';
import authenticate from '../../utils/authenticate';
import duplicate from './duplicate';
import remove from './remove';
import complete from './complete';
import like from './like';
import removeExercise from './remove/exercise';
import updateRoutes from './update';

router.use(authenticate);

router.use('/get', get);
router.use('/create', create);
// router.use('/update', update);
router.use('/duplicate', duplicate);
router.use('/remove/exercise', removeExercise);
router.use('/remove', remove);
router.use('/complete', complete);
router.use('/like', like);

router.use('/update', updateRoutes);

export default router;