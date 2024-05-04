import { FlexBox } from '@app/ui';
import WorkoutExerciseMetricsItem from './WorkoutExerciseMetricsItem';
import { ScrollView } from 'react-native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { Colors } from '@app/utils';
import { useActiveExercise } from '../../../hooks/strength.hook';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useDispatch } from 'react-redux';
import { addExerciseMetric } from '@app/services';
import { PrimaryText } from '@app/elements';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { WorkoutProps } from '@app/types';
import { useGetActiveWorkout } from '../../../hooks/workout.hooks';
import { groupWoExercisesByGroup } from '../../../helpers/workout.helpers';
import { useMemo } from 'react';

const WorkoutExerciseMetrics = () => {
  const exercise = useActiveExercise();
  const bottomNavBarHeight = useBottomTabBarHeight();
  exercise;
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamsList>>();
  const workout = useGetActiveWorkout() as WorkoutProps;
  const groupedExercises = useMemo(() => {
    return groupWoExercisesByGroup(workout);
  }, [workout]);
  const thisExerciseGroup = exercise
    ? groupedExercises.get(exercise.group)
    : undefined;

  const onAddExerciseMetric = () => {
    if (!exercise) return;
    dispatch(addExerciseMetric({ exerciseUid: exercise?._id }));
  };

  const onNavigateToNextGroup = () => {
    if (!exercise || !groupedExercises.size) return;
    const nextGroupNumber = exercise.group + 1;
    let nextGroup = groupedExercises.get(nextGroupNumber);

    if (!nextGroup) {
      nextGroup = groupedExercises.get(0);
    }

    if (!nextGroup) return;

    navigation.navigate(HomeStackScreens.WorkoutGroupExercises, {
      workoutUid: workout._id,
      groupIndex: nextGroup.groupIndex,
    });
  };

  const onNavigateToNextExercise = () => {
    if (!exercise || !groupedExercises.size) return;

    if (!thisExerciseGroup) return;

    // sort exercises in order
    thisExerciseGroup.exercises.sort((a, b) => a.order - b.order);

    const thisExerciseIndex = thisExerciseGroup.exercises.findIndex(
      e => e._id === exercise._id,
    );

    if (thisExerciseIndex < 0) return;

    const nextExerciseIndex =
      thisExerciseIndex >= thisExerciseGroup.exercises.length - 1
        ? 0
        : thisExerciseIndex + 1;

    const nextExercise = thisExerciseGroup.exercises[nextExerciseIndex];

    if (!nextExercise) return;

    navigation.navigate(HomeStackScreens.WorkoutExercise, {
      workoutUid: workout._id,
      exerciseUid: nextExercise._id,
    });
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
      <FlexBox alignItems="center" width="100%" justifyContent="space-between">
        <FlexBox
          flex={1}
          gap={5}
          alignItems="center"
          onPress={onNavigateToNextGroup}>
          <FontAwesome6Icon
            name="chevron-down"
            color={Colors.white}
            size={20}
          />
          <PrimaryText>Group</PrimaryText>
        </FlexBox>
        <FlexBox flex={1} justifyContent="center">
          <FontAwesome6Icon
            name="circle-plus"
            color={Colors.white}
            size={50}
            onPress={onAddExerciseMetric}
          />
        </FlexBox>
        {thisExerciseGroup && thisExerciseGroup.exercises.length > 1 ? (
          <FlexBox
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
            gap={5}
            onPress={onNavigateToNextExercise}>
            <PrimaryText>Exercise</PrimaryText>
            <FontAwesome6Icon
              name="chevron-right"
              color={Colors.white}
              size={20}
            />
          </FlexBox>
        ) : (
          <FlexBox flex={1} />
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default WorkoutExerciseMetrics;
