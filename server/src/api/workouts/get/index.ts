const router = require('express').Router();
import exerciseData from './exercise/data';
import workouts from './workouts';
import workout from './workout';
import healthData from './health-data';
import workoutRoute from './workout-route';

router.use('/exercise/data', exerciseData);
router.use('/health-data', healthData);
router.use('/workout-route/', workoutRoute);
router.use('/', workout);
router.use('/', workouts);

export default router;
