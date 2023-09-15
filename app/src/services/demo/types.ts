export enum DemoStates {
  INIT = "HI! Let's get you familiar with where things are in the app. Press me to go next and hold press to go to previous step.",
  HOME_NAVIGATION_HEALTH = 'This is the health section where you can find everything health related.',
  HOME_HEALTH_EDIT = 'You can change your health goals to better visualize your progress using the pencil icon.',
  HOME_HEALTH_OVERVIEW = 'View your past week health trends to see how you are doing.',
  HOME_WORKOUT_NAV_PRESS = 'Now lets go to the workout section. Please press on the icon under the arrow and then tap me for next step.',
  HOME_WORKOUTS = 'This is your workout section where you can find your workouts.',
  HOME_WORKOUTS_CALENDAR = 'The calendar icon will take you to where you can find all of your workouts.',
  HOME_WORKOUTS_DEVICE_ACTIVITES = 'You can import your apple health workout related data here.',
  HOME_WORKOUS_TODAY_WORKOUT = "If you have workouts scheduled for today, they'll appear here.",
  HOME_WORKOUT_TODAY_PRESS = "Let's see what a workout could look like. Press on the workout below and then press me.",
  WORKOUT_VIEW = "Here's an example of what a workout can look like.",
  WORKOUT_VIEW_STATUS = 'Workouts have three different status. You can change the status by pressing on one.',
  WORKOUT_VIEW_ADD_EXERCISE_BOTTOM = 'Pressing on the bottom plus will add an exercise to the circuit in view.',
  WORKOUT_VIEW_ADD_EXERCISE_TOP = 'Pressing on the top plus will add a new set.',
  WORKOUT_VIEW_CHANGE_WARM_UP = 'Pressing on the set number will change the range of the warm up sets.',
  WORKOUT_VIEW_MENU = 'You can edit and reorder your workout via the menu on the top right of this screen.',
  WORKOUT_VIEW_BACK = "Let's go back to the home screen. Press on the back arrow.",
  EXERCISE_HOME_VIEW_PRESS = 'Now please press on the icon under the arrow and then press me.',
  EXERCISE_HOME_EXERCISE_LIST = 'Navigate here to find all your exercises.',
  EXERCISE_HOME_ENDURANCE = 'Navigate here to find all data related to endurance exercises.',
  EXERCISE_HOME_PINNED = 'Your pinned exercises will appear here.',
  BOTTOM_NAV = 'The bottom navigation bar is where you can navigate to different sections of the app.',
  PERSONAL = 'The section we just explored is the personal health and fitness section.',
  PROGRAMS = 'The programs section is where you can create and download your own programs.',
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
  },
  [DemoStates.WORKOUT_VIEW_MENU]: {
    right: '50%',
    bottom: '0%',
    direction: 'right',
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
