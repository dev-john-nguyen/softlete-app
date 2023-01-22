export interface GroupPosProps {
    [group: string]: PositionProps
}

export interface PositionProps {
    height: number;
    width: number;
    x: number;
    y: number;
}