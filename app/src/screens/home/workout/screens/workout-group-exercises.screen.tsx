import {
  DragAndSortList,
  ItemProps,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { useGetActiveWorkout } from '../hooks/workout.hooks';
import { useCallback, useMemo } from 'react';
import { groupWoExercisesByGroup } from '../helpers/workout.helpers';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { WorkoutContextProvider } from '../contexts';
import WorkoutEmpty from '../components/WorkoutEmpty';
import { WorkoutExerciseProps, WorkoutStatus } from '@app/types';
import ExerciseContainer from '../components/strength/components/exercises/components/ExerciseContainer';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';
import { ExerciseOrderPayload, reorderExercises } from '@app/services';
import { FlexBox } from '@app/ui';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StackNavigationProp } from '@react-navigation/stack';
import { alphabetMap } from '../constants';

const WorkoutGroupExercises = () => {
  const workout = useGetActiveWorkout();
  const { params } =
    useRoute<RouteProp<HomeStackParamsList, 'WorkoutGroupExercises'>>();
  const dispatch = useDispatch<ThunkAppDispatch>();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamsList>>();

  const groupIndex = params?.groupIndex;

  const groupedExercises = useMemo(() => {
    if (!workout) {
      return [];
    }
    const groupedWorkout = groupWoExercisesByGroup(workout);
    const targetGroup = groupedWorkout.get(groupIndex);
    if (!targetGroup) {
      return [];
    }
    return targetGroup.exercises.sort((a, b) => a.order - b.order);
  }, [groupIndex, workout]);

  const nextGroup = useMemo(() => {
    if (!workout) return;

    const allGroupExercises = groupWoExercisesByGroup(workout);

    const nextGroupNumber = groupIndex + 1;
    let nextGroupProps = allGroupExercises.get(nextGroupNumber);

    if (!nextGroupProps) {
      nextGroupProps = allGroupExercises.get(0);
    }

    return nextGroupProps;
  }, [groupIndex, workout]);

  const renderItem = useCallback(
    (data: ItemProps<WorkoutExerciseProps>) => {
      const onNavigateToExercise = () => {
        if (!workout) return;
        navigation.push(HomeStackScreens.WorkoutExercise, {
          exerciseUid: data.data._id,
          workoutUid: workout._id,
        });
      };
      return (
        <ExerciseContainer
          onPress={onNavigateToExercise}
          exercise={data.data}
          letterIndex={groupIndex}
          key={data.id}
        />
      );
    },
    [groupIndex, navigation, workout],
  );

  const onUpdateCallback = (items: ItemProps<WorkoutExerciseProps>[]) => {
    const payloadExercises: ExerciseOrderPayload['exercises'] = {};
    items.forEach((item, i) => {
      payloadExercises[item.data._id as string] = {
        group: groupIndex, // keep it in the same group
        order: i,
      };
    });
    dispatch(reorderExercises({ exercises: payloadExercises }));
  };

  const onNavigateToNextGroup = () => {
    if (!workout || !nextGroup) return;

    navigation.push(HomeStackScreens.WorkoutGroupExercises, {
      workoutUid: workout._id,
      groupIndex: nextGroup.groupIndex,
    });
  };

  const onNavigateBackToWorkout = () => {
    if (!workout) return;
    navigation.navigate(HomeStackScreens.Workout, {
      workoutUid: workout._id,
    });
  };

  const onNavigateToAddExercise = () => {
    if (!workout || workout.status === WorkoutStatus.completed) {
      return;
    }

    const totalExercises = groupedExercises.length + 1;

    navigation.navigate(HomeStackScreens.SearchExercises, {
      group: groupIndex,
      order: totalExercises,
      workoutUid: workout._id,
      programTemplateUid: workout.programUid,
      goBackScreen: HomeStackScreens.WorkoutGroupExercises,
    });
  };

  if (!workout) {
    return <WorkoutEmpty />;
  }

  return (
    <WorkoutContextProvider workout={workout}>
      <ScreenTemplate
        isBackVisible
        rightContent={
          <FlexBox flex={1} alignItems="flex-end" justifyContent="flex-end">
            <FontAwesome6Icon
              name="circle-plus"
              color={Colors.white}
              size={30}
              onPress={onNavigateToAddExercise}
            />
          </FlexBox>
        }>
        <FlexBox paddingTop={10} flex={1}>
          <DragAndSortList
            data={groupedExercises}
            renderItem={renderItem}
            gap={10}
            updateCallback={onUpdateCallback}
          />
        </FlexBox>
        <FlexBox width="100%" padding={15} paddingBottom={20}>
          <FlexBox
            flex={1}
            gap={5}
            alignItems="center"
            onPress={onNavigateBackToWorkout}>
            <FontAwesome6Icon
              name="chevron-left"
              color={Colors.white}
              size={20}
            />
            <PrimaryText>Overview</PrimaryText>
          </FlexBox>
          <FlexBox
            justifyContent="flex-end"
            flex={1}
            gap={5}
            alignItems="center"
            onPress={onNavigateToNextGroup}>
            <PrimaryText>
              Group {nextGroup ? alphabetMap.get(nextGroup.groupIndex) : ''}
            </PrimaryText>
            <FontAwesome6Icon
              name="chevron-down"
              color={Colors.white}
              size={20}
            />
          </FlexBox>
        </FlexBox>
      </ScreenTemplate>
    </WorkoutContextProvider>
  );
};

export default WorkoutGroupExercises;
