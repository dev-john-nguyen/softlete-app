//sort health data by activity name

import { HealthDataProps } from "../../services/workout/types";

// display statistics by cateogry 
export interface StatsProps {
    avg: number;
    min: number;
    max: number;
}

export interface DataProps {
    activityName: string;
    calories: number[];
    duration: number[];
    distance: number[];
    dates: string[];
    data: HealthDataProps[];
}

export enum Stats {
    calories = 'calories',
    duration = 'duration',
    distance = 'distance'
}

export interface GroupedProps {
    [activityName: string]: HealthDataProps[]
}
