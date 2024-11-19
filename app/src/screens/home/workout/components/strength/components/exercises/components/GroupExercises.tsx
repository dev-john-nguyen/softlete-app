import { FC } from 'react';
import { ExerciseDataProps } from '../types';
import { FlexBox } from '@app/ui';
import ExerciseContainer from './ExerciseContainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { useWorkout } from 'src/screens/home/workout/contexts';

type Props = {
  item: ExerciseDataProps;
};

const GroupExercises: FC<Props> = ({ item }) => {
  const { workout } = useWorkout();
  const navigation = useNavigation<NavigationProp<HomeStackParamsList>>();

  const onNavigateToExercise = () => {
    navigation.navigate(HomeStackScreens.WorkoutGroupExercises, {
      workoutUid: workout._id,
      groupIndex: item.letterIndex,
    });
  };

  return (
    <FlexBox column gap={5} width="100%" onPress={onNavigateToExercise}>
      {item.exercises
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(exercise => {
          return (
            <ExerciseContainer
              exercise={exercise}
              letterIndex={item.letterIndex}
              key={exercise._id as string}
            />
          );
        })}
    </FlexBox>
  );
};

export default GroupExercises;
