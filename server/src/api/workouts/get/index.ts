const router = require('express').Router();
import exerciseData from './exercise/data';
import getWorkout from './workout';
import healthData from './health-data';
import workoutRoute from './workout-route';


router.use('/exercise/data', exerciseData);
router.use('/health-data', healthData);
router.use('/workout-route/', workoutRoute);
router.use('/', getWorkout);


export default router;