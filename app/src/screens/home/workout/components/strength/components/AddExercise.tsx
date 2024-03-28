import { useWorkoutState } from '@app/contexts';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import { useMemo } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { HomeStackScreens } from 'src/screens/home/types';
import { WorkoutStatus } from 'src/services/workout/types';
import ExerciseGroupIcon from './ExerciseGroupIcon';
import { useExerciseGroupParams } from '../../../hooks/strength.hook';

const AddExercise = () => {
  const { workout } = useWorkoutState();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { groupParams } = useExerciseGroupParams();

  const addOneToGroupLetterIndexes = useMemo(() => {
    const groupLetterIndexes = [...groupParams.keys()];
    if (!groupLetterIndexes.length) {
      return [0];
    }
    const max = Math.max(...groupLetterIndexes);
    return [...groupLetterIndexes, max + 1];
  }, [groupParams]);

  const onNavigateToAddExercise = (group: number) => {
    if (!workout || workout.status === WorkoutStatus.completed) {
      return;
    }

    const totalExercises = (groupParams.get(group)?.totalExercises ?? 0) + 1;

    navigation.navigate(HomeStackScreens.SearchExercises, {
      group,
      order: totalExercises,
      workoutUid: workout._id,
      programTemplateUid: workout.programTemplateUid,
      goBackScreen: route.params?.goBackScreen,
    });
  };

  const renderItemHandler = (props: ListRenderItemInfo<number>) => {
    return (
      <ExerciseGroupIcon
        letterIndex={props.item}
        onPress={() => onNavigateToAddExercise(props.item)}
      />
    );
  };

  return (
    <FlexBox alignItems="center" justifyContent="space-between">
      <FlexBox gap={10} alignItems="center" flex={1}>
        <FontAwesome6Icon name="circle-plus" color={Colors.white} size={49} />
        <FlatList
          horizontal
          renderItem={renderItemHandler}
          data={addOneToGroupLetterIndexes}
          contentContainerStyle={{ gap: 10 }}
        />
      </FlexBox>
      <FontAwesome6Icon name="chevron-right" color={Colors.white} size={25} />
    </FlexBox>
  );
};

export default AddExercise;
