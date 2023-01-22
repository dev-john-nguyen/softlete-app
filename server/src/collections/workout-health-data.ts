import mongoose from 'mongoose';

export type WorkoutEventProps = {
  endDate: string;
  startDate: string;
  eventTypeInt: number;
  eventType: string;
};

export interface WorkoutHealthDataProps {
  _id: mongoose.Types.ObjectId;
  userUid: string;
  workoutUid: mongoose.Types.ObjectId;
  activityName?: string;
  sourceName?: string;
  duration: number;
  calories?: number;
  distance?: number;
  type?: string;
  activityId?: string;
  heartRates?: number[];
  disMeas?: string;
  date: string;
  workoutEvents?: WorkoutEventProps[];
}

const WorkoutHealthData = new mongoose.Schema(
  {
    userUid: {
      type: String,
      required: true,
      maxLength: 100,
    },
    date: {
      type: Date,
      required: true,
    },
    workoutUid: {
      type: mongoose.Types.ObjectId,
      required: true,
      unqiue: true,
    },
    activityId: {
      type: String,
    },
    activityName: {
      type: String,
    },
    sourceName: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    distance: {
      type: Number,
      default: 0,
    },
    heartRates: {
      type: [Number],
      default: [],
    },
    disMeas: {
      type: String,
      maxLength: 20,
    },
    workoutEvents: {
      type: [
        {
          endDate: String,
          startDate: String,
          eventTypeInt: Number,
          eventType: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<WorkoutHealthDataProps>(
  'Workout-Health-Data',
  WorkoutHealthData,
);
