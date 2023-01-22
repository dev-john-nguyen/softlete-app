import mongoose from 'mongoose';
import { Categories, MuscleGroups } from './types';
import { MeasCats, MeasSubCats } from './user-exercise-measurements';

export interface ExerciseSchemaProps {
  _id: mongoose.Types.ObjectId;
  name?: string;
  description?: string;
  category?: Categories;
  muscleGroup?: string;
  equipment?: string;
  youtubeId?: string;
  localUrl?: string;
  videoId?: string;
  localThumbnail?: string;
  softlete?: boolean;
  measCat?: string;
  measSubCat?: string;
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const exerciseSchema = new mongoose.Schema(
  {
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
      default: '',
    },
    localUrl: {
      type: String,
      default: '',
    },
    localThumbnail: {
      type: String,
      default: '',
    },
    videoId: {
      type: String,
      maxLength: 20,
      default: '',
    },
    softlete: {
      type: Boolean,
      default: true,
    },
    measCat: {
      type: String,
      default: MeasCats.weight,
    },
    measSubCat: {
      type: String,
      default: MeasSubCats.lb,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ExerciseSchemaProps>('Exercise', exerciseSchema);
