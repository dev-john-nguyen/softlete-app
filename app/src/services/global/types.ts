
export interface GlobalProps {
    isNewUser: boolean;
    demoState: DemoStates;
    notificationToken: {
        os: string;
        token: string;
    },
    register: {
        username: string;
        name: string;
    };
    offline: boolean;
    exercisesVideoBatch: ExercisesVideoBatchProps[];
    woImageBatch: WoImageBatchProps[];
    softleteUid: string;
    connectAppStore: boolean;
}

export interface WoImageBatchProps {
    imageId: string;
    base64: string;
    workoutUid?: string;
    url?: string;
}

export interface ExercisesVideoBatchProps {
    exerciseUid?: string;
    videoId: string;
    path?: string;
    localUrl: string;
    compressedUrl?: string;
    url?: string;
    thumbnail?: string;
    localThumbnail: string;
    admin?: boolean;
    remove?: boolean;
}

export enum DemoStates {
    HOME_WOS = 'HOME_WOS',
    HOME_STATS = 'HOME_STATS',
    HOME_EXERCISES = 'HOME_EXERCISE',
    CALENDAR = 'CALENDAR',
    LOCATE_STATS_NAV = 'LOCATE_STATS_NAV',
    LOCATE_EXS_NAV = 'LOCATE_EXS_NAV',
    START_ADD_WO = 'START_ADD_WO',
    WO_HEADER = 'WO_HEADER',
    WO_ADD_EX = 'WO_ADD_EX',
    EX_SEARCH = 'EX_SEARCH',
    WO_EX_ADDED = 'WO_EX_ADDED',
    WO_PROGRESS = 'WO_PROGRESS',
    WO_COMPLETED = 'WO_COMPLETED',
    END = 'END'
}