import mongoose from 'mongoose';
import {
  GoalDurationType,
  GoalSubTypes,
  GoalTypes,
  GoalMeasurements,
} from './types';

export interface GoalInitProps {
  _id?: string;
  type: GoalTypes;
  durationType: GoalDurationType;
  userUid: string;
  exerciseUid?: string;
  name: string;
  description?: string;
  goal: number;
  startDate?: string;
  endDate?: string;
  measurement?: GoalMeasurements;
  subType?: GoalSubTypes;
}

export interface GoalProps {
  _id?: mongoose.Types.ObjectId;
  type: GoalTypes;
  subType?: GoalSubTypes;
  measurement?: GoalMeasurements;
  durationType: GoalDurationType;
  userUid: string;
  exerciseUid?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  goal: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

const GoalsSchema: mongoose.Schema<GoalProps> = new mongoose.Schema(
  {
    userUid: {
      type: String,
      required: true,
      maxLength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: GoalTypes,
    },
    subType: {
      type: String,
      enum: GoalSubTypes,
    },
    measurement: {
      type: String,
      enum: GoalMeasurements,
    },
    durationType: {
      type: String,
      required: true,
      enum: GoalDurationType,
    },
    exerciseUid: {
      type: mongoose.Types.ObjectId,
    },
    name: {
      required: true,
      type: String,
      maxLength: 200,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    goal: {
      required: true,
      type: Number,
      maxLength: 99999999999999,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<GoalProps>('Goal', GoalsSchema);
