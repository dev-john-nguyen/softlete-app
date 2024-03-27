import { useWorkoutState } from '@app/contexts';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';

const WorkoutHeader = () => {
  const [showDescription, setShowDescription] = useState(false);
  const generatedPrograms = useSelector(
    (state: ReducerProps) => state.program.generatedPrograms,
  );
  const { workout } = useWorkoutState();

  const program = useMemo(() => {
    return generatedPrograms.find(p => p._id === workout.programUid);
  }, [workout, generatedPrograms]);

  return (
    <FlexBox column onPress={() => setShowDescription(!showDescription)}>
      <FlexBox justifyContent="space-between">
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
          <FlexBox gap={10} marginTop={10}>
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
