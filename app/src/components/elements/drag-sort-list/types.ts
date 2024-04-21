export type Positions = {
  [id: string]: PositionProps;
};

export type PositionProps = {
  positionY: number;
  height: number;
  sortOrder: number;
};

export type ItemLayoutProps = {
  height: number;
  pageX: number;
  pageY: number;
  translateY: number;
};

export interface ItemProps<T> {
  id: string;
  data: T;
}

export const CUSTOM_OFF_SET = 50;

export const GAP_BETWEEN_GROUPS = 20;
