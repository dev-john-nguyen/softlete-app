export enum DemoStates {
  INIT = "Welcome! Let's do a quick tour of the app. Press me to go to the next step. Press and hold me to go to previous step. You can also drag me around if I get in the way.",
  HOME_OVERVIEW = "The screen we're currently on is the home screen where you can find all services related to improving your health and fitness.",
  HOME_NAVIGATION_HEALTH = 'The section currently in view is the health section where you can find information that can help you evaluate your health trends. This data is pulled from your device.',
  HOME_HEALTH_EDIT = 'You can set your daily goals for sleep and calories burned.',
  HOME_HEALTH_OVERVIEW = "You can view your past week health trends to see how you're doing.",
  HOME_WORKOUT_NAV_PRESS = 'Please navigate to the workout section of the home screen.',
  HOME_WORKOUTS = "The workout section is where you can find all your workouts you've created.",
  HOME_WORKOUTS_CALENDAR = 'The calendar view allows you to see all your workouts in one place.',
  HOME_WORKOUTS_DEVICE_ACTIVITES = 'If you have activites that are stored on your device via your iOS Health & Fitness apps, you can import them here.',
  HOME_WORKOUS_TODAY_WORKOUT = 'The workouts you have scheduled for today will appear here as well.',
  HOME_WORKOUT_TODAY_PRESS = "Please navigate to today's workout so we can take a look at what a workout might look like.",
  WORKOUT_VIEW = "A workout's name, description, and program association will appear at the bottom of the screen.",
  WORKOUT_VIEW_STATUS = 'There are 3 stages of a workout to allow you and others to identify the current status.',
  WORKOUT_VIEW_ADD_EXERCISE = 'There are two ways to add exercises to your workout.',
  WORKOUT_VIEW_ADD_EXERCISE_BOTTOM = 'The bottom plus will add an exercise to the circuit in view.',
  WORKOUT_VIEW_ADD_EXERCISE_TOP = 'And the top plus icon will create a new set and add the exercise to it.',
  WORKOUT_VIEW_CHANGE_WARM_UP = 'You can define a range of warm up sets. To change the range, you can press on the desired set number. Warm ups always start from 1.',
  WORKOUT_VIEW_MENU = 'The workout menu has other actions that you can utilize like restructuring or removing your workout.',
  WORKOUT_VIEW_BACK = 'Please press on the back arrow to go back to the home screen.',
  EXERCISE_HOME_VIEW_PRESS = 'Now please navigate to the exercise section of the home screen.',
  EXERCISE_HOME = 'The exercise section is where you can find all your exercises and tools to help you progress.',
  EXERCISE_HOME_EXERCISE_LIST = 'You can view all your exercises in a list, create goals, and track your progress.',
  EXERCISE_HOME_ENDURANCE = "You can view all endurance related analytics and goals you've created.",
  EXERCISE_HOME_PINNED = "The exercises that you've pinned will automatically appear here for quicker access.",
  BOTTOM_NAV = 'There are 4 sections of the app that you visit via the bottom navigation bar.',
  PERSONAL = 'The section we just explored is the personal health and fitness section.',
  PROGRAMS = 'The programs section is where you can access, download, and create programs.',
  SOCIAL = 'The social section is where you can connect and view other athlete profiles (not available yet).',
  SETTINGS = 'Lastly, the settings section where you can update your profile, change your password, logout, etc.',
  END = "That's the end of the tour. Hope you enjoy our services!",
}

export const DemoStatePositions: {
  [key in DemoStates]: {
    left?: number | string;
    right?: number | string;
    top?: number | string;
    bottom?: number | string;
    direction?: 'left' | 'right' | 'down' | 'up';
    bannerY?: number;
  };
} = {
  [DemoStates.INIT]: {},
  [DemoStates.HOME_OVERVIEW]: {},
  [DemoStates.HOME_NAVIGATION_HEALTH]: {
    left: 50,
    bottom: 45,
  },
  [DemoStates.HOME_HEALTH_EDIT]: {
    left: -35,
    bottom: 0,
    direction: 'right',
  },
  [DemoStates.HOME_HEALTH_OVERVIEW]: {
    left: 0,
    bottom: 0,
    direction: 'right',
  },
  [DemoStates.HOME_WORKOUT_NAV_PRESS]: {
    left: 152,
    bottom: 45,
  },
  [DemoStates.HOME_WORKOUTS]: {
    left: 152,
    bottom: 45,
  },
  [DemoStates.HOME_WORKOUTS_CALENDAR]: {
    right: 30,
    bottom: 0,
    direction: 'right',
  },
  [DemoStates.HOME_WORKOUTS_DEVICE_ACTIVITES]: {
    left: -35,
    bottom: 0,
    direction: 'right',
  },
  [DemoStates.HOME_WORKOUS_TODAY_WORKOUT]: {
    left: '50%',
  },
  [DemoStates.HOME_WORKOUT_TODAY_PRESS]: {
    left: '50%',
    bottom: '0%',
  },
  [DemoStates.WORKOUT_VIEW]: {
    left: '10%',
    bottom: '10%',
  },
  [DemoStates.WORKOUT_VIEW_STATUS]: {
    bottom: '14%',
    left: '0%',
    direction: 'right',
  },
  [DemoStates.WORKOUT_VIEW_ADD_EXERCISE]: {},
  [DemoStates.WORKOUT_VIEW_ADD_EXERCISE_BOTTOM]: {
    left: '46.5%',
    bottom: '30%',
  },
  [DemoStates.WORKOUT_VIEW_ADD_EXERCISE_TOP]: {
    left: '40%',
    top: '20%',
    direction: 'right',
    bannerY: 120,
  },
  [DemoStates.WORKOUT_VIEW_CHANGE_WARM_UP]: {
    left: '8%',
    top: '15%',
    bannerY: 50,
  },
  [DemoStates.WORKOUT_VIEW_MENU]: {
    right: '50%',
    bottom: '0%',
    direction: 'right',
    bannerY: 120,
  },
  [DemoStates.WORKOUT_VIEW_BACK]: {
    direction: 'left',
    left: '60%',
  },
  [DemoStates.EXERCISE_HOME_VIEW_PRESS]: {
    right: '15%',
    bottom: 45,
    bannerY: 60,
  },
  [DemoStates.EXERCISE_HOME]: {},
  [DemoStates.EXERCISE_HOME_EXERCISE_LIST]: {
    right: 30,
    bottom: 0,
    direction: 'right',
  },
  [DemoStates.EXERCISE_HOME_ENDURANCE]: {
    left: -35,
    bottom: 0,
    direction: 'right',
  },
  [DemoStates.EXERCISE_HOME_PINNED]: {
    top: '0%',
    left: '50%',
  },
  [DemoStates.BOTTOM_NAV]: {
    left: '47%',
    top: '-120%',
  },
  [DemoStates.PERSONAL]: {
    left: '9%',
    top: '-50%',
  },
  [DemoStates.PROGRAMS]: {
    left: '34%',
    top: '-50%',
  },
  [DemoStates.SOCIAL]: {
    right: '34.5%',
    top: '-50%',
  },
  [DemoStates.SETTINGS]: {
    right: '9%',
    top: '-50%',
  },
  [DemoStates.END]: {},
};

export type DemoProps = {
  state?: DemoStates;
};
