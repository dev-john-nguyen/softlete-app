import { WorkoutExerciseDataProps } from "../workout/types";
import { ExerciseProps } from "../exercises/types";

export interface MiscProps {
    pinExercisesAnalytics: AnalyticsProps[],
    fetchedAnalytics: AnalyticsProps[];
    activeAnalytics: AnalyticsProps;
    pinExercises: PinExerciseProps[];
}

export interface PinExerciseProps {
    _id?: string;
    exerciseUid: string;
    exercise?: ExerciseProps;
}

export interface AnalyticsProps {
    exerciseUid: string;
    exercise?: ExerciseProps;
    analytics?: ExercisesAnalyticsProps;
    data: {
        workoutExerciseUid: string;
        date: string;
        data: WorkoutExerciseDataProps[];
    }[]
}

export interface ExercisesAnalyticsProps {
    recent?: number;
    max: number;
    min: number;
    avg: number;
    sum: number;
    total: number;
}

export enum AnalyticsFilterTypes {
    avg = 'avg',
    min = 'min',
    max = 'max'
}



export interface MiscActionProps {
    fetchExerciseAnalytics: (fromDate: string, toDate: string, exerciseUids: string[], athlete?: boolean) => Promise<void | AnalyticsProps[]>;
    fetchPinExerciseAnalytics: (fromDate: string, toDate: string, pinExercises: PinExerciseProps[], athlete?: boolean) => Promise<AnalyticsProps[]>;
    fetchExerciseAnalyticsDates: (dates: string[], exerciseUids: string[], athlete?: boolean) => Promise<void | AnalyticsProps[]>;
}