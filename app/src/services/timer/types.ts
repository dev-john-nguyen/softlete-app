export type TimerProps = {
  timerId?: NodeJS.Timer;
  isRunning?: boolean;
  time: {
    hrs: number;
    mins: number;
    secs: number;
  };
};

export const initialTime = {
  hrs: 0,
  mins: 0,
  secs: 0,
};
