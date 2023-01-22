export type AdminStackParamsList = {
    AdminHome: undefined;
    AdminExercises: { admin: boolean }
    AdminEditExercise: { admin: boolean, create: boolean }
    AdminUploadExerciseVideo: { admin: boolean }
}

export enum AdminStackList {
    AdminHome = 'AdminHome',
    AdminExercises = 'AdminExercises',
    AdminEditExercise = 'AdminEditExercise',
    AdminUploadExerciseVideo = 'AdminUploadExerciseVideo'
}

