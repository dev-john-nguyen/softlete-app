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
  WORKOUT_VIEW = "Here's an example of a workout, 'Lower Body'. You'll notice the different status to indicate the current stage of the workout. Tap on the back button to go back. Drag me down, I might be covering the back button.",
  EXERCISE_LIST = "Here's where you can go to view all your exercises. Can also create your own.",
  EXERCISE_ENDURANCE_TOOLS = "Here's where all the endurance related tools are located.",
  EXERCISE_PINS = 'Here will be all your pinned exercises where you can quickly track your progress trends',
  PROGRAMS = 'Visit here to view programs and you can also create your own.',
}

export const DemoStatePositions: {
  [key in DemoStates]: {
    left?: number | string;
    right?: number | string;
    top?: number | string;
    bottom?: number | string;
    direction?: 'left' | 'right' | 'down' | 'up';
  };
} = {
  [DemoStates.HOME_NAVIGATION_HEALTH]: {
    left: 50,
    bottom: 45,
  },
  [DemoStates.HOME_HEALTH_EDIT]: {
    left: -35,
    direction: 'right',
  },
  [DemoStates.HOME_HEALTH_OVERVIEW]: {
    left: 10,
    direction: 'right',
  },
  [DemoStates.HOME_WORKOUT_NAV_PRESS]: {
    left: 155,
    bottom: 45,
  },
  [DemoStates.HOME_WORKOUTS]: {
    left: 155,
    bottom: 45,
  },
  [DemoStates.HOME_WORKOUTS_CALENDAR]: {
    right: 30,
    direction: 'right',
  },
  [DemoStates.HOME_WORKOUTS_DEVICE_ACTIVITES]: {
    left: -35,
    direction: 'right',
  },
  [DemoStates.HOME_WORKOUS_TODAY_WORKOUT]: {
    left: '50%',
  },
  [DemoStates.HOME_WORKOUT_TODAY_PRESS]: {
    left: '50%',
  },
  [DemoStates.WORKOUT_VIEW]: {},
};

export type DemoProps = {
  state?: DemoStates;
};
