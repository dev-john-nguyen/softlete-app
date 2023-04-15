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

export interface GoalProps {
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

const healthGoalsTemplateSchema: mongoose.Schema<GoalProps> =
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
            name: {
              type: String,
              maxLength: 200,
            },
            description: {
              type: String,
              maxLength: 500,
            },
            goal: { type: Number, maxLength: 99999999 },
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

export default mongoose.model<GoalProps>('Goal', healthGoalsTemplateSchema);
