export enum Categories {
  other = 'other',
  aerobic = 'aerobic',
  strength = 'strength',
  stretching = 'stretching',
  balance = 'balance',
  weights = 'weights',
}

export enum MuscleGroups {
  other = 'other',
  glutes = 'glutes',
  quads = 'quads',
  calves = 'calves',
  groin = 'groin',
  biceps = 'biceps',
  triceps = 'triceps',
  lats = 'lats',
  back = 'back',
  shoulders = 'shoulders',
  chest = 'chest',
  hamstring = 'hamstring',
  forearms = 'forearms',
  abs = 'abs',
  legs = 'legs',
  arms = 'arms',
}

export interface LocationProps {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: string;
  speed: number;
  speedAccuracy: number;
}

//4 exercise categories
//endurance, strength, flexibility, and balance
//sub categories?
//weights / resistance
//body part target
