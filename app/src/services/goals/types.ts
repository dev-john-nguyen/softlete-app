export interface GoalsRootStateProps {
  user: {
    exercises: ExerciseGoalProps[];
    endurances: GoalProps[];
    healths: GoalProps[];
  };
}

export enum GoalTypes {
  exercise = 'exercise',
  endurance = 'endurance',
  health = 'health',
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
}

export interface GoalProps {
  _id: string;
  type: GoalTypes;
  durationType: GoalDurationType;
  userUid: string;
  exerciseUid?: string;
  name: string;
  description?: string;
  goal: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface GoalRespProps
  extends Omit<GoalProps, 'startDate' | 'endDate'> {
  _id: string;
  startDate?: string;
  endDate?: string;
}

export interface ExerciseGoalProps extends GoalProps {
  startDate: string;
  endDate: string;
}

// goal status is not an attribute in goal schema, but a calculated value
export enum GoalStatus {
  pending = 'pending',
  inProgress = 'inProgress',
  completed = 'completed',
}
