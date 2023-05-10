const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import upsert_exercise from './upsert-exercise';
import delete_exercise from './delete-exercise';
import exercise_analytics from './exercise-analytics';
import get from './get';

router.use(authenticate);
router.use('/upsert-exercise', upsert_exercise);
router.use('/delete-exercise', delete_exercise);
router.use('/exercise-goal-analytics', exercise_analytics);
router.use('/get', get);

export default router;
