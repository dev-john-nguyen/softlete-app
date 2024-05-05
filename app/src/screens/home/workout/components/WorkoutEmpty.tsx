import { PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { useGoBack } from '../hooks/general.hooks';

const WorkoutEmpty = () => {
  const { onGoBackHandler } = useGoBack();
  return (
    <ScreenTemplate isBackVisible onGoBack={onGoBackHandler}>
      <FlexBox
        column
        alignItems="center"
        justifyContent="center"
        flex={1}
        gap={10}>
        <FontAwesome6Icon
          name="circle-question"
          color={Colors.yellow}
          size={60}
        />
        <PrimaryText size="large" fontSize={40}>
          404
        </PrimaryText>
        <PrimaryText width="80%" textAlign="center">
          Sorry, looks like this workout does not exist.
        </PrimaryText>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default WorkoutEmpty;
