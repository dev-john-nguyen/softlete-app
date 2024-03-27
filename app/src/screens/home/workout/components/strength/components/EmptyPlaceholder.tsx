import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import Icon from 'react-native-vector-icons/FontAwesome6';

const EmptyPlaceholder = () => {
  return (
    <FlexBox alignItems="center" justifyContent="center" flex={0.5}>
      <Icon
        name="dumbbell"
        size={120}
        color={Colors.white}
        style={{ position: 'absolute', opacity: 0.2 }}
      />
      <PrimaryText fontSize={50} variant="primary">
        Train
      </PrimaryText>
    </FlexBox>
  );
};

export default EmptyPlaceholder;
