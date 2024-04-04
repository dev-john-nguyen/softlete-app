import { FlexBox } from '@app/ui';
import { FC, useState } from 'react';
import { WorkoutExerciseProps } from 'src/types/workouts.types';
import ExerciseGroupIcon from '../../ExerciseGroupIcon';
import { ExerciseDataProps } from '../types';
import { PrimaryText } from '@app/elements';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { Colors } from '@app/utils';
import ExerciseMoveMenu from './ExerciseMoveMenu';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';
import { removeWorkoutExercise } from 'src/services/workout/actions';

type Props = {
  exercise: WorkoutExerciseProps;
  item: ExerciseDataProps;
};

const ExerciseContainer: FC<Props> = ({ exercise, item }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<ThunkAppDispatch>();

  const onRemove = () => dispatch(removeWorkoutExercise(exercise));

  if (isMenuOpen) {
    return <ExerciseMoveMenu onClose={() => setIsMenuOpen(false)} />;
  }

  return (
    <FlexBox width="100%" padding={5} alignItems="center" gap={10}>
      <ExerciseGroupIcon letterIndex={item.letterIndex} />
      <FlexBox flex={1}>
        <PrimaryText size="large" textTransform="capitalize">
          {exercise.exercise?.name ?? 'N/A'}
        </PrimaryText>
      </FlexBox>
      <FlexBox gap={15}>
        <FontAwesome6Icon
          name="folder-tree"
          size={18}
          color={Colors.white}
          onPress={() => setIsMenuOpen(true)}
        />
        <FontAwesome6Icon
          name="trash"
          size={18}
          color={Colors.white}
          onPress={onRemove}
        />
        <FontAwesome6Icon name="chevron-right" size={20} color={Colors.white} />
      </FlexBox>
    </FlexBox>
  );
};

export default ExerciseContainer;
