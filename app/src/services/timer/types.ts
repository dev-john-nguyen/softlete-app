export type Time = {
  hrs: number;
  mins: number;
  secs: number;
};

export type TimerProps = {
  timerId?: NodeJS.Timer;
  isRunning?: boolean;
  time: Time;
  initialTime: Time;
};

export const defaultTime = {
  hrs: 0,
  mins: 0,
  secs: 0,
};
