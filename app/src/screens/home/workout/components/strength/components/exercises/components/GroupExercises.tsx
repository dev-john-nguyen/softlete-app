import { FC } from 'react';
import { ExerciseDataProps } from '../types';
import { FlexBox } from '@app/ui';
import { PrimaryText } from '@app/elements';
import ExerciseGroupIcon from '../../ExerciseGroupIcon';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type Props = {
  item: ExerciseDataProps;
};

const GroupExercises: FC<Props> = ({ item }) => {
  return (
    <FlexBox column gap={5} width="100%">
      {item.exercises.map(exercise => {
        return (
          <FlexBox
            width="100%"
            padding={5}
            key={exercise._id as string}
            alignItems="center"
            gap={10}>
            <ExerciseGroupIcon
              letterIndex={item.letterIndex}
              onPress={() => undefined}
            />
            <FlexBox flex={1}>
              <PrimaryText size="large" textTransform="capitalize">
                {exercise.exercise?.name ?? 'N/A'}
              </PrimaryText>
            </FlexBox>
            <FlexBox gap={15}>
              <FontAwesome6Icon name="trash" size={18} color={Colors.white} />
              <FontAwesome6Icon
                name="chevron-right"
                size={20}
                color={Colors.white}
              />
            </FlexBox>
          </FlexBox>
        );
      })}
    </FlexBox>
  );
};

export default GroupExercises;
