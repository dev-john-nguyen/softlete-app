
export type ProgramStackParamsList = {
    Templates: undefined;
    Program: undefined;
    ProgramWorkout: undefined;
    ProgramModal: undefined;
    ProgramSearchExercises: { programStack: boolean };
    ProgramExercise: { programStack: boolean };
    ProgramUploadVideo: { programStack: boolean };
    ProgramEditExercise: { programStack: boolean };
    ProgramEditExerciseDetails: { programStack: boolean };
    ProgramExerciseAnalytics: undefined;
    ProgramReorderWorkoutExercises: undefined;
    ProgramWorkoutHeader: undefined;
    ProgramDownload: undefined;
    ProgramWorkoutModal: undefined;
    ProgramAccess: undefined;
    ProgramHeader: undefined;
    ProgramInput: undefined;
}


export enum ProgramStackScreens {
    Templates = 'Templates',
    Program = 'Program',
    ProgramWorkout = 'ProgramWorkout',
    ProgramModal = 'ProgramModal',
    ProgramSearchExercises = 'ProgramSearchExercises',
    ProgramExercise = 'ProgramExercise',
    ProgramUploadVideo = 'ProgramUploadVideo',
    ProgramEditExercise = 'ProgramEditExercise',
    ProgramReorderWorkoutExercises = 'ProgramReorderWorkoutExercises',
    ProgramWorkoutHeader = 'ProgramWorkoutHeader',
    ProgramDownload = 'ProgramDownload',
    ProgramWorkoutModal = 'ProgramWorkoutModal',
    ProgramAccess = 'ProgramAccess',
    ProgramHeader = 'ProgramHeader',
    ProgramExerciseAnalytics = 'ProgramExerciseAnalytics',
    ProgramEditExerciseDetails = 'ProgramEditExerciseDetails',
    ProgramInput = 'ProgramInput'
}
