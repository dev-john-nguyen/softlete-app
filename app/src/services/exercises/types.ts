export interface ExerciseBaseProps {
    data: ExerciseProps[];
    muscleGroups: string[];
    equipments: string[];
    targetExercise?: ExerciseProps;
}

export interface ExerciseFormProps {
    name?: string;
    description?: string;
    measCat: MeasCats,
    measSubCat: MeasSubCats,
    muscleGroup: MuscleGroups,
    equipment: string,
    category: Categories;
    localUrl?: string;
    youtubeId?: string;
    url?: string;
    softlete?: boolean;
    videoId?: string;
    thumbnail?: string;
    localThumbnail?: string;
}

export interface ExerciseProps extends ExerciseFormProps {
    _id?: string;
    userUid?: string;
}

export enum MeasCats {
    weight = 'weight',
    distance = 'distance',
    time = 'time',
}

export enum TimeCats {
    sec = 'seconds',
    min = 'minutes',
    hr = 'hour'
}

export enum DisCats {
    miles = 'miles',
    km = 'kilometers',
    in = 'inches',
    ft = 'feets',
    yds = 'yards',
    m = 'meters'
}

export enum WtCats {
    kg = 'kilograms',
    lb = 'pounds',
    ounce = 'ounces',
}

export enum Categories {
    other = 'other',
    aerobic = 'aerobic',
    strength = 'strength',
    stretching = 'stretching',
    balance = 'balance'
}

export enum MuscleGroups {
    other = 'other',
    glutes = 'glutes',
    quads = 'quads',
    calves = 'calves',
    groin = 'groin',
    biceps = 'biceps',
    triceps = 'triceps',
    lats = 'lats',
    back = 'back',
    shoulders = 'shoulders',
    chest = 'chest',
    hamstring = 'hamstring',
    forearms = 'forearms',
    abs = 'abs',
    legs = 'legs',
    arms = 'arms'
}

export enum Equipments {
    none = 'none',
    barbell = 'barbell',
    kettlebell = 'kettlebell',
    resistanceBands = 'resistance bands',
    bench = 'bench',
    dumbbell = 'dumbbell',
    physioballs = 'physio balls',
    cable = 'cable',
    plates = 'plates',
    treadmill = 'treadmill',
    rowMachine = 'row machine',
    elliptical = 'elliptical',
}


export enum MeasSubCats {
    none = 'none',

    kg = 'kilograms',
    lb = 'pounds',
    oz = 'ounces',

    mi = 'miles',
    km = 'kilometers',
    in = 'inches',
    ft = 'feets',
    yds = 'yards',
    m = 'meters',

    sec = 'seconds',
    min = 'minutes',
    hr = 'hour'
}


export interface ExerciseActionProps {
    createNewExercise: (data: ExerciseFormProps, admin?: boolean) => Promise<void>
    updateExercise: (data: ExerciseProps, owner?: boolean, admin?: boolean) => Promise<void>
    removeExercise: (_id: ExerciseProps['_id'], admin?: boolean) => Promise<void>;
    searchExercises: (query: string, limit?: number) => Promise<void | ExerciseProps[]>;
    fetchExercises: (exerciseUids: string[], athlete?: boolean) => Promise<void | ExerciseProps[] | undefined>;
    findExercise: (name: string) => Promise<ExerciseProps | void>;
    searchByCat: (category: Categories) => Promise<ExerciseProps[] | void>;
    fetchMusclesAndEquipments: () => Promise<void>;
    fetchLocalStoreExercisesToState: () => Promise<void>;
    fetchAllUserExercises: () => Promise<void>;
}