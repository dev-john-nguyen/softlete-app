import { IconOptions } from '@app/icons';
import { LatLng } from 'react-native-maps';

export interface MarkerProps {
  coords: LatLng;
  color?: string;
  name: string;
  value: string;
  icon: IconOptions;
}

export type RouteSegmentProps = {
  timeFormatted: string;
  time: number;
  altitude: number;
  order: number;
};

export interface RouteStatsProps {
  avgAlt: number;
  segments: RouteSegmentProps[];
}
