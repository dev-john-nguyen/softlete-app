import mongoose from 'mongoose';

export interface ExerciseGoalProps {
  _id?: mongoose.Types.ObjectId;
  exerciseUid: mongoose.Types.ObjectId;
  name: string;
  description: string;
  goal: number;
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
}

export interface HealthGoalsProps {
  _id?: mongoose.Types.ObjectId;
  userUid: string;
  sleep: number;
  activeCalories: number;
  exercises: ExerciseGoalProps[];
}

export enum GoalStatus {
  pending = 'pending',
  inProgress = 'inProgress',
  completed = 'completed',
}

const healthGoalsTemplateSchema: mongoose.Schema<HealthGoalsProps> =
  new mongoose.Schema(
    {
      userUid: {
        type: String,
        required: true,
        maxLength: 100,
        unique: true,
      },
      sleep: {
        type: Number,
        maxLength: 100,
        default: 8,
      },
      activeCalories: {
        type: Number,
        maxLength: 99999999,
        default: 0,
      },
      exercises: {
        type: [
          {
            exerciseUid: mongoose.Types.ObjectId,
            name: String,
            description: String,
            goal: Number,
            startDate: Date,
            endDate: Date,
            status: {
              type: String,
              enum: GoalStatus,
              default: GoalStatus.pending,
            },
          },
        ],
        default: [],
      },
    },
    {
      timestamps: true,
    },
  );

export default mongoose.model<HealthGoalsProps>(
  'Health-Goal',
  healthGoalsTemplateSchema,
);
