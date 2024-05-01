import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useWorkoutExerciseState } from '../context';
import { FC } from 'react';
import { ScrollView } from 'react-native';
import { WorkoutExerciseDataProps } from '@app/types';
import { WorkoutExerciseDataMetrics } from '@app/services';

type Props = {
  metrics: WorkoutExerciseDataProps;
};

const WorkoutExerciseMetricsItem: FC<Props> = ({ metrics }) => {
  const { onTriggerNumericKeyboard } = useWorkoutExerciseState();

  const onMetricPress = (type: WorkoutExerciseDataMetrics) => () => {
    const activeItemValue = {
      id: metrics._id,
      metric: type,
    };
    const defaultValue = metrics[
      type as keyof WorkoutExerciseDataProps
    ] as number;
    onTriggerNumericKeyboard(activeItemValue, defaultValue);
  };

  return (
    <FlexBox
      alignSelf="flex-start"
      alignItems="center"
      gap={5}
      width="100%"
      justifyContent="space-between">
      <FlexBox marginRight={10} column>
        <Icon name="circle-check" color={Colors.green} size={30} />
      </FlexBox>
      <FlexBox flex={1} gap={10}>
        <ScrollView horizontal contentContainerStyle={{ gap: 5 }}>
          <FlexBox column>
            <FlexBox
              minWidth={60}
              onPress={onMetricPress(WorkoutExerciseDataMetrics.reps)}
              padding={10}
              borderRadius={100}
              borderColor={Colors.white}
              borderWidth={1}>
              <PrimaryText opacity={metrics.reps ? 1 : 0.3}>
                {metrics.reps || 'Reps'}
              </PrimaryText>
            </FlexBox>
          </FlexBox>
          <FlexBox column>
            <FlexBox
              minWidth={90}
              onPress={onMetricPress(WorkoutExerciseDataMetrics.performVal)}
              padding={10}
              borderRadius={100}
              borderColor={Colors.white}
              borderWidth={1}>
              <PrimaryText
                opacity={metrics.performVal ? 1 : 0.3}
                textTransform="capitalize">
                {metrics.performVal || 'Perform'}
              </PrimaryText>
            </FlexBox>
          </FlexBox>

          <FlexBox column>
            <FlexBox
              minWidth={80}
              onPress={onMetricPress(WorkoutExerciseDataMetrics.pct)}
              padding={10}
              borderRadius={100}
              borderColor={Colors.white}
              borderWidth={1}>
              <PrimaryText opacity={metrics.pct ? 1 : 0.3}>
                {metrics.pct ? metrics.pct + '%' : 'Effort'}
              </PrimaryText>
            </FlexBox>
          </FlexBox>
        </ScrollView>
      </FlexBox>
      <FlexBox gap={15} alignItems="center">
        <Icon name="temperature-quarter" color={Colors.white} size={25} />
        <Icon name="trash" color={Colors.white} size={20} />
      </FlexBox>
    </FlexBox>
  );
};

export default WorkoutExerciseMetricsItem;
