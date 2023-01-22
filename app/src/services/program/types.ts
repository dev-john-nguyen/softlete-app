import { WorkoutProps, WorkoutHeaderProps, WorkoutExerciseProps, DataArrProps, HealthDataProps, ViewWorkoutProps, EditWorkoutProps } from "../workout/types";

export interface RootProgramProps {
    programs: ProgramProps[];
    targetProgram: ProgramProps;
    copiedProgramWorkout: string;
    generatedPrograms: GeneratedProgramProps[];
    viewWorkout: ViewWorkoutProps;
    workoutHeader: EditWorkoutProps;
}

export interface GeneratedProgramProps extends ProgramHeaderProps {
    programTemplateUid: string;
    startDate: string;
}

export interface ProgramProps extends ProgramHeaderProps {
    workouts?: ProgramWorkoutProps[];
    likeUids: string[];
}

export interface WorkoutByWeekProps extends ProgramWorkoutProps {
    dayOfWeek: number
}

export interface ProgramByWeekProps {
    [week: string]: WorkoutByWeekProps[]
}

export interface ProgramWorkoutHeaderProps extends Omit<WorkoutHeaderProps, 'date' | 'programUid'> {
    daysFromStart: number;
    programTemplateUid: string;
    imageUri?: string;
}

export interface ProgramWorkoutProps extends Omit<WorkoutProps, 'date' | 'programUid'> {
    daysFromStart: number;
    programTemplateUid: string;
}

export interface ProgramHeaderProps {
    _id: string;
    name: string;
    description: string;
    isPrivate: boolean;
    imageUri?: string;
    accessCodes: string[];
    likeUids: string[]
}

export interface NewProgramProps extends Omit<ProgramHeaderProps, '_id' | 'likeUids'> {
    _id?: string
}

export interface GroupByDayProps {
    [dayofweek: string]: WorkoutExerciseProps[]
}

export interface ProgramActionProps {
    updateProgramWorkoutHeader: (workoutHeader: ProgramWorkoutHeaderProps) => Promise<void>;
    updateProgramWorkoutExercises: (workoutUid: string, exercises: WorkoutExerciseProps[], removedExercises?: WorkoutExerciseProps[]) => Promise<void>;
    updateProgramHeader: (programData: NewProgramProps, imageBase64?: string) => Promise<void | undefined>;
    fetchPrograms: (athlete?: boolean) => Promise<void>;
    setTargetProgram: (programHeader: ProgramHeaderProps, athlete?: boolean, softlete?: boolean) => Promise<void | ProgramProps>;
    setProgramViewWorkout: (workoutUid: string, programUid: string, athlete?: boolean) => Promise<void>;
    duplicateProgramWorkout: (daysFromStart: number) => Promise<void>;
    removeProgramWorkout: (programWorkoutUid: string) => Promise<void>;
    removeProgram: (programUid: string) => Promise<void>;
    generateProgram: (programUid: string, startDate: string, accessCode?: string) => Promise<void>;
    fetchGeneratedPrograms: (athlete?: boolean) => Promise<void>;
    removeGeneratedProgram: (programUid: string) => Promise<void>;
    updateProgramExerciseData: (data: DataArrProps[]) => Promise<void | WorkoutExerciseProps[]>;
    updateProgramAccessCode: (programUid: string, accessCode?: string) => Promise<void>;
    removeProgramWorkoutExercise: (exercise: WorkoutExerciseProps) => Promise<void>;
    updateProgramWoHealthData: (programTemplateUid: string, programWorkoutUid: string, healthData: HealthDataProps) => Promise<void>;
}