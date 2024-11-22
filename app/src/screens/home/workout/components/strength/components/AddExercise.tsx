import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { HomeStackScreens } from 'src/screens/home/types';
import { WorkoutStatus } from 'src/types/workouts.types';
import ExerciseGroupIcon from './ExerciseGroupIcon';
import { useExerciseGroupParams } from '../../../hooks/strength.hook';
import { useWorkout } from '../../../contexts';

const AddExercise = () => {
  const { workout } = useWorkout();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { groupParams } = useExerciseGroupParams();

  const groups = useMemo(() => {
    const groupLetterIndexes = [...groupParams.keys()].sort((a, b) => a - b);
    if (!groupLetterIndexes.length) {
      return [];
    }
    return [...groupLetterIndexes];
  }, [groupParams]);

  const onNavigateToAddExercise = (group = 0) => {
    if (!workout || workout.status === WorkoutStatus.completed) {
      return;
    }

    const totalExercises = (groupParams.get(group)?.totalExercises ?? 0) + 1;

    navigation.navigate(HomeStackScreens.SearchExercises, {
      group,
      order: totalExercises,
      workoutUid: workout._id,
      programTemplateUid: workout.programUid,
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
    <FlexBox
      alignItems="center"
      justifyContent="space-between"
      marginTop={10}
      paddingLeft={15}
      paddingRight={15}>
      <FlexBox gap={10} alignItems="center" flex={1}>
        <FontAwesome6Icon
          name="circle-plus"
          color={Colors.white}
          size={49}
          onPress={() =>
            onNavigateToAddExercise(groups.length ? Math.max(...groups) + 1 : 0)
          }
        />
        <FlatList
          horizontal
          renderItem={renderItemHandler}
          data={groups}
          contentContainerStyle={{ gap: 10 }}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default AddExercise;
