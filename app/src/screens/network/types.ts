import { ExerciseProps } from "../../services/exercises/types";

export type NetworkStackParamList = {
    SearchAthletes: undefined;
    AthleteDashboard: undefined;
    AthleteWorkout: undefined;
    AthleteExercise: { exercise: ExerciseProps, athlete: boolean };
    AthleteAnalytics: { athlete: boolean, exerciseUid: string };
    AthleteProgramTemplate: { athlete: boolean };
    Notifications: undefined;
    Chats: undefined;
    Message: undefined;
    Templates: undefined;
    AthleteModal: undefined;
    Friends: undefined;
    DownloadProgramModal: { athlete: boolean };
    AthleteOverviewModal: undefined;
    AthleteSearchExercises: undefined;
    AthleteFriends: undefined;
    Maintenance: undefined;
};

export enum NetworkStackScreens {
    Maintenance = 'Maintenance',
    SearchAthletes = 'SearchAthletes',
    AthleteDashboard = 'AthleteDashboard',
    AthleteWorkout = 'AthleteWorkout',
    AthleteExercise = 'AthleteExercise',
    AthleteAnalytics = 'AthleteAnalytics',
    AthleteProgramTemplate = 'AthleteProgramTemplate',
    Chats = 'Chats',
    Message = 'Message',
    Notifications = 'Notifications',
    Templates = 'Templates',
    AthleteModal = 'AthleteModal',
    Friends = 'Friends',
    DownloadProgramModal = 'DownloadProgramModal',
    AthleteOverviewModal = 'AthleteOverviewModal',
    AthleteSearchExercises = 'AthleteSearchExercises',
    AthleteFriends = 'AthleteFriends'
}

export enum NetworkScreenTitles {
    SearchAthletes = 'Search',
    AthleteDashboard = 'Dashboard',
    AthleteExercise = 'Exercise',
    AthleteAnalytics = 'Analytics',
}