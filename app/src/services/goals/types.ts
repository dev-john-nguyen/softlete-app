export interface GoalsRootStateProps {
  user: {
    exercises: GoalProps[];
    endurances: GoalProps[];
    healths: HealthGoalProps;
  };
}

export type HealthGoalProps = {
  sleep?: GoalProps;
  activeCalories?: GoalProps;
};

export enum GoalTypes {
  exercise = 'exercise',
  endurance = 'endurance',
  health = 'health',
  sleep = 'sleep',
  active_calories = 'active_calories',
}

export enum GoalDurationType {
  daily = 'daily',
  dateRange = 'dateRange',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

export interface GoalInitProps {
  _id?: string;
  exerciseUid?: string;
  name: string;
  description?: string;
  goal: number;
  startDate?: string;
  endDate?: string;
  type: GoalTypes;
  subType?: GoalSubTypes;
  measurement?: GoalMeasurements;
}

export enum GoalMeasurements {
  mi = 'mi',
  min = 'min',
  hr = 'hr',
  mins_per_mi = 'mins_per_mi',
}

export enum GoalSubTypes {
  endurance_distance = 'distance',
  endurance_duration = 'duration',
  endurance_avg_pace = 'avg_pace',
}

export const GoalSubTypesLabels = {
  [GoalSubTypes.endurance_distance]: {
    label: 'Distance',
    value: GoalSubTypes.endurance_distance,
  },
  [GoalSubTypes.endurance_duration]: {
    label: 'Duration',
    value: GoalSubTypes.endurance_duration,
  },
  [GoalSubTypes.endurance_avg_pace]: {
    label: 'Avg Pace',
    value: GoalSubTypes.endurance_avg_pace,
  },
};

export interface GoalProps {
  _id: string;
  type: GoalTypes;
  durationType: GoalDurationType;
  userUid: string;
  exerciseUid?: string;
  name: string;
  description?: string;
  goal: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface GoalRespProps
  extends Omit<GoalProps, 'startDate' | 'endDate'> {
  _id: string;
  startDate?: string;
  endDate?: string;
}

// goal status is not an attribute in goal schema, but a calculated value
export enum GoalStatus {
  pending = 'Pending',
  inProgress = 'In Progress',
  completed = 'Completed',
}
