const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import createWo from './workout';
import createExercise from './exercise';
import createUser from './user';

router.use(authenticate);
router.use('/create/exercise', createExercise);
router.use('/create/workout', createWo);
router.use('/create/user', createUser);

export default router;