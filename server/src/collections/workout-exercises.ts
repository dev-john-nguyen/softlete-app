import mongoose from 'mongoose';

export interface WorkoutExercisesProps {
  _id: mongoose.Types.ObjectId;
  date: Date | string;
  data: WorkoutExerciseDataProps[];
  userUid: mongoose.Types.ObjectId;
  exerciseUid: mongoose.Types.ObjectId;
  workoutUid: mongoose.Types.ObjectId;
  group: Number;
  order: Number;
  sets: Number;
  reps: Number;
  measurement: String;
  comments: String;
  track: Boolean;
  programUid?: mongoose.Types.ObjectId;
  calcRef?: Number;
}

export interface WorkoutExerciseDataProps {
  _id?: mongoose.Types.ObjectId;
  reps: Number;
  performVal: Number;
  predictVal: Number;
  pct: Number;
  warmup: Boolean;
  completed?: Boolean;
}

function formatHandler(value: mongoose.Types.Decimal128) {
  return value ? parseFloat(value.toString()) : 0;
}

function dataFormatHandler(data?: any) {
  if (!data) return [];
  return data.map((doc: any) => {
    const docJSON = doc.toJSON();
    const formatted = {
      ...docJSON,
      performVal: formatHandler(docJSON.performVal),
      predictVal: formatHandler(docJSON.predictVal),
    };
    return formatted;
  });
}

function calcRefFormatHandler(ref: mongoose.Types.Decimal128) {
  return formatHandler(ref);
}

const workoutExercisesSchema = new mongoose.Schema(
  {
    data: {
      type: [
        {
          reps: Number,
          performVal: {
            type: mongoose.Types.Decimal128,
            default: 0,
          },
          predictVal: {
            type: mongoose.Types.Decimal128,
            default: 0,
          },
          pct: {
            type: Number,
            default: 100,
            min: 0,
            max: 100,
          },
          warmup: {
            type: Boolean,
            default: false,
          },
          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
      validate: [
        (val: WorkoutExerciseDataProps[]) => val.length <= 50,
        'exceeds the data limit of 50',
      ],
      required: true,
      get: dataFormatHandler,
      default: [],
    },
    date: {
      type: Date,
      required: true,
    },
    programUid: {
      type: mongoose.Types.ObjectId,
    },
    userUid: {
      type: String,
      required: true,
      maxLength: 100,
    },
    workoutUid: {
      type: mongoose.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },
    exerciseUid: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    calcRef: {
      type: mongoose.Types.Decimal128,
      get: calcRefFormatHandler,
    },
    group: {
      type: Number,
      required: true,
      max: 100,
    },
    order: {
      type: Number,
      required: true,
      max: 100,
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  },
);

export default mongoose.model<WorkoutExercisesProps>(
  'Workout-Exercise',
  workoutExercisesSchema,
);
