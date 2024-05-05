import express from 'express';
const router = express.Router();
import Workout from '../../../collections/workouts';
import WorkoutExercises, {
  NewWorkoutExerciseProps,
} from '../../../collections/workout-exercises';
import Program, { ProgramProps } from '../../../collections/programs';
import { Types, Document } from 'mongoose';
import { routeErrorWrapper } from '../../../utils/route-error-wrapper';

type RequestPayload = {
  workoutUid: string;
  exercises: {
    _id: string;
    group: number;
    order: number;
    data: NewWorkoutExerciseProps['data'];
  }[];
};

type Program =
  | (Document<unknown, any, ProgramProps> &
      ProgramProps &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null;

router.put(
  '/',
  routeErrorWrapper(
    async (
      request: express.Request<null, null, RequestPayload>,
      response: express.Response,
    ) => {
      const { uid } = request.headers;
      const { body } = request;
      if (!body) return response.status(400).send('Invalid request');

      // get workout
      const workout = await Workout.findById(body.workoutUid);

      if (!workout) return response.status(401).send('Workout does not exists');

      const date = workout.date;

      const insertPayload: NewWorkoutExerciseProps[] = [];

      for (const exercise of body.exercises) {
        const exerciseUid = new Types.ObjectId(exercise._id);
        if (!exerciseUid)
          return response.status(401).send('Incorrect exercise id.');
        insertPayload.push({
          exerciseUid: exerciseUid,
          group: exercise.group,
          order: exercise.order,
          workoutUid: workout._id,
          programUid: workout.programUid,
          userUid: uid as string,
          date: date,
          data: exercise.data,
        });
      }

      const result = await WorkoutExercises.insertMany(insertPayload);
      response.send(result);
    },
  ),
);

export default router;
