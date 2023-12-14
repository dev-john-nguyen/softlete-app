const router = require('express').Router();
import updateStatus from './status';
import updateData from './data';
import updateHeader from './header';
import updateExercises from './exercises';
import updateHealth from './health-data';
import updateWorkoutRoute from './workout-route';
import batch from './batch';

router.use('/exercises', updateExercises);
router.use('/header', updateHeader);
router.use('/status', updateStatus);
router.use('/data', updateData);
router.use('/health-data', updateHealth);
router.use('/workout-route', updateWorkoutRoute);
router.use('/batch', batch);

export default router;