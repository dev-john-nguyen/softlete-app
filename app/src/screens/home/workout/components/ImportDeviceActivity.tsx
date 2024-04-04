import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const ImportDeviceActivity = () => {
  return (
    <FlexBox column marginTop={20} gap={10} marginLeft={25} marginRight={25}>
      <FlexBox gap={10} alignItems="center">
        <FontAwesome6Icon name="upload" size={20} color={Colors.white} />
        <PrimaryText>Import From Device</PrimaryText>
      </FlexBox>
      <FlexBox marginLeft={25}>
        <PrimaryText fontSize={12} opacity={0.5}>
          {'* Imported "Strength Training" on 3/19/2024'}
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default ImportDeviceActivity;
