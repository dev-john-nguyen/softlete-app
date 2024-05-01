import { FlexBox } from '@app/ui';
import WorkoutExerciseMetricsItem from './WorkoutExerciseMetricsItem';
import { ScrollView } from 'react-native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { Colors } from '@app/utils';
import { useActiveExercise } from '../../../hooks/strength.hook';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useDispatch } from 'react-redux';
import { addExerciseMetric } from '@app/services';

const WorkoutExerciseMetrics = () => {
  const exercise = useActiveExercise();
  const bottomNavBarHeight = useBottomTabBarHeight();
  exercise;
  const dispatch = useDispatch();

  const onAddExerciseMetric = () => {
    if (!exercise) return;
    dispatch(addExerciseMetric({ exerciseUid: exercise?._id }));
  };

  return (
    <FlexBox flex={1} marginTop={20} column paddingBottom={bottomNavBarHeight}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 10, flexGrow: 1, paddingBottom: 20 }}>
        {exercise?.data.map(metrics => {
          return (
            <WorkoutExerciseMetricsItem
              key={metrics._id}
              metrics={metrics}
              exerciseUid={exercise._id}
            />
          );
        })}
      </ScrollView>
      <FlexBox alignItems="center" width="100%" justifyContent="center">
        <FontAwesome6Icon
          name="circle-plus"
          color={Colors.white}
          size={50}
          onPress={onAddExerciseMetric}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default WorkoutExerciseMetrics;
