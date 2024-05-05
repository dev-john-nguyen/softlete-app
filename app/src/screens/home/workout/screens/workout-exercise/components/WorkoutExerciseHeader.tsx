import { useState } from 'react';
import { useActiveExercise } from '../../../hooks/strength.hook';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import Icon from 'react-native-vector-icons/FontAwesome6';

const WorkoutHeaderExercise = () => {
  const exercise = useActiveExercise();
  const [showDescription, setShowDescription] = useState(true);

  const exerciseDetails = exercise?.details;

  return (
    <FlexBox column onPress={() => setShowDescription(!showDescription)}>
      <FlexBox justifyContent="space-between" alignItems="center">
        <PrimaryText size="large" textTransform="capitalize">
          {exerciseDetails?.name ?? 'Not Found'}
        </PrimaryText>
        <Icon
          name={showDescription ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={Colors.white}
        />
      </FlexBox>
      {showDescription && (
        <FlexBox column marginTop={5}>
          <PrimaryText
            size="small"
            opacity={exerciseDetails?.description ? 1 : 0.5}>
            {exerciseDetails?.description ?? 'No description provided'}
          </PrimaryText>
          <FlexBox gap={5} marginTop={10}>
            <Icon name="ruler" size={20} color={Colors.white} />
            <PrimaryText
              size="small"
              opacity={exerciseDetails?.measSubCat ? 1 : 0.5}>
              : {exerciseDetails?.measSubCat ?? 'Not Assigned'}
            </PrimaryText>
          </FlexBox>
        </FlexBox>
      )}
    </FlexBox>
  );
};

export default WorkoutHeaderExercise;
