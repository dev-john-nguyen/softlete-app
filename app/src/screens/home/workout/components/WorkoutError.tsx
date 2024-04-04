import { PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { useGoBack } from '../hooks/general.hooks';

const WorkoutError = () => {
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
          name="circle-exclamation"
          color={Colors.red}
          size={60}
        />
        <PrimaryText size="large" fontSize={30}>
          Oops!
        </PrimaryText>
        <PrimaryText>Something went wrong.</PrimaryText>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default WorkoutError;
