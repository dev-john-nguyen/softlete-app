import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PrimaryText from '../../components/elements/PrimaryText';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import StyleConstants from '../../components/tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';

interface Props {}

const Maintenance = ({}: Props) => {
  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <PrimaryText styles={styles.text}>Coming Soon</PrimaryText>
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: StyleConstants.largeFont,
    color: BaseColors.white,
  },
});
export default Maintenance;
