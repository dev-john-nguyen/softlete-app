import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { FC } from 'react';

type Props = {
  label: string;
  isActive?: boolean;
};

const WorkoutStagesItem: FC<Props> = ({ label, isActive }) => {
  const borderRadius = () => {
    if (isActive) {
      return 100;
    }
    return 0;
  };

  return (
    <FlexBox
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding={15}
      paddingTop={7}
      paddingBottom={10}
      backgroundColor={Colors.white}
      borderRadius={borderRadius()}>
      <PrimaryText color={Colors.primary} fontSize={12}>
        {label}
      </PrimaryText>
    </FlexBox>
  );
};

export default WorkoutStagesItem;
