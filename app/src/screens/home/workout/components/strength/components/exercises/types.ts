export type ItemLayoutProps = {
  height: number;
  pageX: number;
  pageY: number;
  translateY: number;
};

export type ItemPositionProps = {
  positionY: number;
  originalY: number;
  sortOrder: number;
  data: ExerciseDataProps;
};

export type ExerciseDataProps = {
  label: string;
  id: string;
};
