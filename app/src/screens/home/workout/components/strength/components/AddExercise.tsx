import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const AddExercise = () => {
  return (
    <FlexBox alignItems="center" justifyContent="space-between">
      <FlexBox gap={10} alignItems="center">
        <FontAwesome6Icon name="circle-plus" color={Colors.white} size={30} />
        <PrimaryText size="large">Exercise</PrimaryText>
      </FlexBox>
      <FontAwesome6Icon name="chevron-right" color={Colors.white} size={25} />
    </FlexBox>
  );
};

export default AddExercise;
