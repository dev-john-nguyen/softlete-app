import FastImage from 'react-native-fast-image';
import { ProgramHeaderProps } from '../program/types';
import { WorkoutProps } from '../../types/workouts.types';

export async function prefetchWoImages(wos: WorkoutProps[]) {
  const images: { uri: string }[] = [];
  if (!wos) {
    return;
  }

  wos.forEach(w => {
    if (w.imageUri) {
      images.push({ uri: w.imageUri });
    }
  });
  if (images.length > 0) {
    FastImage.preload(images);
  }
}

export async function prefetchProgramImages(programs: ProgramHeaderProps[]) {
  const images: { uri: string }[] = [];
  programs.forEach(w => {
    if (w.imageUri) {
      images.push({ uri: w.imageUri });
    }
  });
  if (images.length > 0) {
    FastImage.preload(images);
  }
}
