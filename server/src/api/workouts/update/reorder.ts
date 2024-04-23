import express, { Request, Response } from 'express';
import WorkoutExercise from '../../../collections/workout-exercises';
import { routeErrorWrapper } from '../../../utils/route-error-wrapper';

const router = express.Router();

type Payload = {
  workoutUid: string;
  exercises: {
    [exerciseUid: string]: {
      group: number;
      order: number;
    };
  };
};
router.put(
  '/',
  routeErrorWrapper(
    async (request: Request<null, null, Payload>, response: Response) => {
      const { uid } = request.headers;
      if (!uid) return response.status(401).send('cannot find user id.');
      const payload = request.body;

      const workoutExercises = await WorkoutExercise.find({
        workoutUid: payload.workoutUid,
        userUid: uid,
      });

      if (!workoutExercises)
        return response.status(404).send('Workout not found');

      for (const exercise of workoutExercises) {
        const updatedProps = payload.exercises[exercise._id.toString()];
        if (!updatedProps) continue; // exercise doesn't exists
        exercise.group = updatedProps.group;
        exercise.order = updatedProps.order;
        await exercise.save();
      }
      response.send(workoutExercises);
    },
  ),
);

export default router;
