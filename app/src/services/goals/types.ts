export enum GoalStatus {
  pending = 'pending',
  inProgress = 'inProgress',
  completed = 'completed',
}

export type ExerciseGoal = {
  _id?: string;
  startDate: string;
  endDate: string;
  goal: number;
  description: string;
  name: string;
  exerciseUid: string;
  status: GoalStatus;
};

export type GoalStateProps = {
  _id: string;
  exercises: ExerciseGoal[];
  updatedAt?: string;
  createdAt?: string;
  sleep: number;
  activeCalories: number;
};

export interface GoalsRootStateProps {
  user: GoalStateProps;
}
