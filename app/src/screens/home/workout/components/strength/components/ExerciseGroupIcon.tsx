import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import { FC } from 'react';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { alphabetMap } from '../../../constants';

type Props = {
  letterIndex: number;
  onPress: () => void;
};

const ExerciseGroupIcon: FC<Props> = ({ letterIndex, onPress }) => {
  return (
    <FlexBox
      onPress={onPress}
      alignItems="center"
      justifyContent="center"
      height={47}
      width={47}
      backgroundColor={rgba(Colors.whiteRbg, 0.2)}
      borderRadius={100}>
      <PrimaryText
        variant="primary"
        fontSize={25}
        position="absolute"
        zIndex={100}>
        {alphabetMap.get(letterIndex)}
      </PrimaryText>
      <FontAwesome6Icon
        name="dumbbell"
        style={{ position: 'absolute', opacity: 0.1 }}
        color={Colors.white}
        size={30}
      />
    </FlexBox>
  );
};

export default ExerciseGroupIcon;
