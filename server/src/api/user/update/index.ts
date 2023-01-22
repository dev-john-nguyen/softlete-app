const router = require('express').Router();
import profile from './profile';
import pinExercises from './pin-exercises';
import token from './token';

router.use('/profile', profile);
router.use('/pin-exercises', pinExercises);
router.use('/token', token)
export default router;