export enum DemoStates {
  INIT = "HI! Let's get you familiar with where things are in the app. Tap me to go to the next step.",
  HOME_NAVIGATION = 'This is the home screen that has 3 sections, Health, Workout, and Exercises.',
  HOME_HEALTH = 'This is the health section where you can find your health related data. The multibar icon is where you can find your past weeks health data.',
  HOME_HEALTH_EDIT = 'You can change your health goals to better visualize your progress using the pencil icon.',
  HOME_WORKOUTS = 'This is your workout section where you can find your workouts.',
  HOME_WORKOUTS_CALENDAR = 'The calendar icon will take you to where you can find all of your workouts.',
  HOME_WORKOUTS_DEVICE_ACTIVITES = 'You can import your apple health fitness activites via the import icon.',
  HOME_WORKOUS_TODAY_WORKOUT = 'Your workouts for today will appear here. You can tap and navigate to the workout.',
  WORKOUT_VIEW = "Here's an example of a workout, 'Lower Body'. You'll notice the different status to indicate the current stage of the workout. Tap on the back button to go back. Drag me down, I might be covering the back button.",
  EXERCISE_LIST = "Here's where you can go to view all your exercises. Can also create your own.",
  EXERCISE_ENDURANCE_TOOLS = "Here's where all the endurance related tools are located.",
  EXERCISE_PINS = 'Here will be all your pinned exercises where you can quickly track your progress trends',
  PROGRAMS = 'Visit here to view programs and you can also create your own.',
}

export type DemoProps = {
  state?: DemoStates;
};
