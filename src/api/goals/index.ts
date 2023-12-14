import express from 'express';
import authenticate from '../../utils/authenticate';
import upsert_exercise from './upsert-exercise';
import delete_exercise from './delete-exercise';
import exercise_analytics from './exercise-analytics';
import endurance_analytics from './endurance-analytics';
import upsert_health from './upsert-health';
import get from './get';
const router = express.Router();

router.use(authenticate);
router.use('/upsert-exercise', upsert_exercise);
router.use('/delete-exercise', delete_exercise);
router.use('/exercise-goal-analytics', exercise_analytics);
router.use('/endurance-goal-analytics', endurance_analytics);
router.use('/upsert-health', upsert_health);
router.use('/get', get);

export default router;
