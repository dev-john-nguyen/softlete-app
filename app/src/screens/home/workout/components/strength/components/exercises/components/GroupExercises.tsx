import { FC } from 'react';
import { ExerciseDataProps } from '../types';
import { FlexBox } from '@app/ui';
import ExerciseContainer from './ExerciseContainer';

type Props = {
  item: ExerciseDataProps;
};

const GroupExercises: FC<Props> = ({ item }) => {
  return (
    <FlexBox column gap={5} width="100%">
      {item.exercises.map(exercise => {
        return (
          <ExerciseContainer
            exercise={exercise}
            item={item}
            key={exercise._id as string}
          />
        );
      })}
    </FlexBox>
  );
};

export default GroupExercises;
