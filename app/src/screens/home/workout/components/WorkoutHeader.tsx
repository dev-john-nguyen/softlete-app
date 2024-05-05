import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { useWorkout } from '../contexts';

const getGeneratedPrograms = (state: ReducerProps) =>
  state.program.generatedPrograms;

const WorkoutHeader = () => {
  const [showDescription, setShowDescription] = useState(false);
  const generatedPrograms = useSelector(getGeneratedPrograms);
  const { workout } = useWorkout();

  const program = useMemo(() => {
    return generatedPrograms.find(p => p._id === workout.programUid);
  }, [workout, generatedPrograms]);

  return (
    <FlexBox
      column
      onPress={() => setShowDescription(!showDescription)}
      marginLeft={15}
      marginRight={15}>
      <FlexBox justifyContent="space-between" alignItems="center">
        <PrimaryText size="large" textTransform="capitalize">
          {workout.name}
        </PrimaryText>
        <Icon
          name={showDescription ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={Colors.white}
        />
      </FlexBox>
      {showDescription && (
        <FlexBox column marginTop={5}>
          <PrimaryText size="small" opacity={workout.description ? 1 : 0.5}>
            {workout.description ?? 'No description provided'}
          </PrimaryText>
          <FlexBox gap={5} marginTop={10}>
            <Icon name="book" size={20} color={Colors.white} />
            <PrimaryText size="small" opacity={workout.description ? 1 : 0.5}>
              : {program ? program.name : 'Not Assigned'}
            </PrimaryText>
          </FlexBox>
        </FlexBox>
      )}
    </FlexBox>
  );
};

export default WorkoutHeader;
