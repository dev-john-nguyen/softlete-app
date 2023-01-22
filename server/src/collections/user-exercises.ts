import mongoose from 'mongoose';
import { Categories, MuscleGroups } from './types';

export interface UserExerciseSchemaProps {
  _id?: mongoose.Types.ObjectId;
  userUid: string;
  name?: string;
  description?: string;
  category?: Categories;
  muscleGroup?: string;
  equipment?: string;
  youtubeId?: string;
  localUrl?: string;
  videoId?: string;
  localThumbnail?: string;
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const userExerciseSchema = new mongoose.Schema(
  {
    userUid: {
      type: String,
      required: true,
      maxLength: 100,
    },
    name: {
      type: String,
      lowercase: true,
      maxLength: 200,
    },
    description: {
      type: String,
      maxLength: 400,
    },
    category: {
      type: String,
      default: Categories.other,
      lowercase: true,
    },
    muscleGroup: {
      type: String,
      default: MuscleGroups.other,
      lowercase: true,
    },
    equipment: {
      type: String,
      default: '',
      maxlength: 200,
    },
    youtubeId: {
      type: String,
    },
    localUrl: {
      type: String,
    },
    localThumbnail: {
      type: String,
    },
    videoId: {
      type: String,
      maxLength: 20,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<UserExerciseSchemaProps>(
  'User-Exercise',
  userExerciseSchema,
);
