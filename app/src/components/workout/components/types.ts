export enum DropOptions {
  group,
  exercise,
  plus,
}

export type DropProps = {
  x: number;
  y: number;
  height: number;
  width: number;
};

export const defaultDrop = {
  x: 0,
  y: 0,
  height: 0,
  width: 0,
};
