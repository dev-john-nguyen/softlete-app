const router = require('express').Router();
import userExercises from './user-exercises';
import softleteExercises from './softlete-exercises';
import userAllExercises from './all-user';
import softAllExercises from './all-softlete';
//note: users route will check both users and softlete
router.use('/users/all', userAllExercises);
router.use('/users', userExercises);
router.use('/softlete/all', softAllExercises);
router.use('/softlete', softleteExercises);

export default router;