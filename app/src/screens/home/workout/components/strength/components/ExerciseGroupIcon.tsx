import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import { FC } from 'react';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { alphabetMap } from '../../../constants';

type Props = {
  letterIndex: number;
  onPress?: () => void;
  onLongPress?: () => void;
  customColors?: {
    backgroundColor: string;
    fontColor: string;
    iconColor: string;
  };
  customSizes?: {
    container: number;
    fontSize: number;
    iconSize: number;
  };
};

const ExerciseGroupIcon: FC<Props> = ({
  letterIndex,
  onPress,
  onLongPress,
  customSizes,
  customColors,
}) => {
  const colors = customColors ?? {
    backgroundColor: rgba(Colors.whiteRbg, 0.1),
    fontColor: Colors.white,
    iconColor: Colors.white,
  };

  const sizeProps = customSizes ?? {
    container: 47,
    fontSize: 25,
    iconSize: 25,
  };

  return (
    <FlexBox
      onLongPress={onLongPress}
      onPress={onPress}
      alignItems="center"
      justifyContent="center"
      height={sizeProps.container}
      width={sizeProps.container}
      backgroundColor={colors.backgroundColor}
      borderRadius={100}>
      <PrimaryText
        variant="primary"
        fontSize={sizeProps.fontSize}
        position="absolute"
        zIndex={100}
        color={colors.fontColor}>
        {alphabetMap.get(letterIndex)}
      </PrimaryText>
      <FontAwesome6Icon
        name="dumbbell"
        style={{ position: 'absolute', opacity: 0.1 }}
        color={colors.iconColor}
        size={sizeProps.iconSize}
      />
    </FlexBox>
  );
};

export default ExerciseGroupIcon;
