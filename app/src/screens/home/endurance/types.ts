import { PickerOptionProp } from 'src/components/elements/Picker';
import { HealthDataProps, WorkoutTypes } from 'src/services/workout/types';

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

export const EnduranceFilterOptions: PickerOptionProp[] = [
  {
    value: '',
    label: '',
  },
  {
    value: 'pace',
    label: 'Pace',
  },
  {
    value: 'distance',
    label: 'Distance',
  },
  {
    value: 'duration',
    label: 'Duration',
  },
];

export interface HealthDataAnalytics extends HealthDataProps {
  workout: string;
}
