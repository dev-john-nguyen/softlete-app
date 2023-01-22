import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PlusSvg from '../../../assets/PlusSvg';
import BaseColors from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';
import StyleConstants from '../../tools/StyleConstants';
import { HomeBoxShadow } from '../types';

interface Props {
  onPress: () => void;
}

const WoAdd = ({ onPress }: Props) => {
  return (
    <FlexBox
      onPress={onPress}
      borderWidth={1}
      borderColor={Colors.white}
      padding={20}
      alignItems="center"
      justifyContent="center"
      borderRadius={5}>
      <View style={styles.add}>
        <PlusSvg strokeColor={BaseColors.primary} />
      </View>
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StyleConstants.baseMargin,
    marginBottom: StyleConstants.baseMargin,
    height: normalize.height(9),
    borderRadius: 5,
    ...HomeBoxShadow,
  },
  add: {
    width: normalize.width(12),
    height: normalize.width(12),
    borderRadius: 100,
    backgroundColor: BaseColors.white,
    padding: 10,
  },
});
export default WoAdd;
