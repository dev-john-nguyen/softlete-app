import { PinExerciseProps, AnalyticsProps } from "../misc/types";
import { WorkoutProps, MonthWorkoutsProps, ViewWorkoutProps, HealthDataProps } from "../workout/types";
import { ProgramProps, GeneratedProgramProps } from "../program/types";
import { FriendProps, FriendStatus } from "../user/types";
import { ExerciseProps } from "../exercises/types";

export interface AthletesRootProps {
    workouts: WorkoutProps[];
    monthWorkouts: MonthWorkoutsProps;
    selectedDate: string;
    selectedDateWorkouts: WorkoutProps[];
    viewWorkout: ViewWorkoutProps;
    filterByProgramUid: string;
    curAthlete: AthleteProfileProps;
    fetchedAnalytics: AnalyticsProps[];
    programs: ProgramProps[];
    targetProgram: ProgramProps;
    generatedPrograms: GeneratedProgramProps[];
    profiles: AthleteProfileProps[];
    likedWoIds: string[];
    likedProgramUids: string[];
    exercises: ExerciseProps[];
    healthData: HealthDataProps[];
    friends: FriendProps[]
}


export interface AthleteWorkoutsProps {
    date: string,
    workouts: WorkoutProps[]
}

export interface AthleteProfileProps {
    username: string;
    athlete: string;
    name: string;
    imageUri: string;
    isPrivate: boolean;
    bio: string;
    uid: string;
    pinExercises: PinExerciseProps[];
    blockUids: string[]
}

export interface AthleteActionProps {
    fetchAthleteWorkouts: (athleteUid: string, fromDate: string, toDate: string) => Promise<WorkoutProps[] | undefined>;
    setAthleteViewWorkout: (workoutUid: string, isProgram?: boolean) => Promise<void>;
    sendFriendRequest: (userUid: string, sendFriendRequest: FriendStatus) => Promise<void>;
    fetchAthleteProfiles: (userUids: string[]) => Promise<void | AthleteProfileProps[]>;
    getAthletesProfile: (userUids: string[]) => Promise<AthleteProfileProps[]>;
    reportAthlete: (userUid: string, description: string) => Promise<void>;
    likeWorkout: (workoutUid: string) => Promise<void>;
    likeProgram: (programUid: string) => Promise<void>;
    fetchAllAthleteExercises: (athleteUid: string) => Promise<void | undefined | ExerciseProps[]>;
    fetchAthleteHealthData: (athleteUid: string) => Promise<void | HealthDataProps[] | undefined>;
    getAthleteFriends: (athleteUid: string) => Promise<void | FriendProps[]>;
}