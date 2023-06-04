import { PickerOptionProp } from 'src/components/elements/Picker';
import {
  HealthDataProps,
  WorkoutProps,
  WorkoutTypes,
} from 'src/services/workout/types';

export const EnduranceOptions: PickerOptionProp[] = [
  {
    value: '',
    label: '',
  },
  ...Object.entries(WorkoutTypes)
    .filter(
      ([key]) =>
        key !== WorkoutTypes.TraditionalStrengthTraining &&
        key !== WorkoutTypes.Activity,
    )
    .map(([label, value]) => ({
      value,
      label,
    })),
];

export enum EnduranceFilterValues {
  pace = 'pace',
  distance = 'distance',
  duration = 'duration',
  null = '',
}

export const EnduranceFilterOptions: PickerOptionProp[] = [
  {
    value: '',
    label: '',
  },
  {
    value: EnduranceFilterValues.pace,
    label: 'Pace',
  },
  {
    value: EnduranceFilterValues.distance,
    label: 'Distance',
  },
  {
    value: EnduranceFilterValues.duration,
    label: 'Duration',
  },
];

export interface HealthDataAnalytics extends HealthDataProps {
  workout: WorkoutProps;
}
