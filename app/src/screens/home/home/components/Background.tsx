import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeBG from '../../../../assets/images/HomeBg';
import RunningMan from '../../../../assets/images/RunningMan';
import BaseColors from '../../../../utils/BaseColors';
import { normalize } from '../../../../utils/tools';
import PrimaryText from '../../../../components/elements/PrimaryText';

const HomeBackground = () => {
  return (
    <>
      <View style={styles.bg}>
        <HomeBG />
      </View>

      <View style={styles.runningContainer}>
        <View style={styles.run}>
          <RunningMan />
        </View>
      </View>

      <PrimaryText
        styles={[
          styles.bgText,
          { top: '50%', left: '60%', fontSize: normalize.width(11) },
        ]}>
        Plan
      </PrimaryText>
      <PrimaryText
        styles={[
          styles.bgText,
          { top: '60%', left: '20%', fontSize: normalize.width(9) },
        ]}>
        Train
      </PrimaryText>
      <PrimaryText
        styles={[
          styles.bgText,
          { top: '75%', left: '40%', fontSize: normalize.width(10) },
        ]}>
        Evaluate
      </PrimaryText>
      <PrimaryText
        styles={[
          styles.bgText,
          { top: '90%', left: '10%', fontSize: normalize.width(12) },
        ]}>
        Repeat
      </PrimaryText>
    </>
  );
};

const styles = StyleSheet.create({
  bgText: {
    position: 'absolute',
    zIndex: -100,
    color: BaseColors.white,
    width: '100%',
    opacity: 0.03,
  },
  bg: {
    height: normalize.width(1),
    width: '120%',
    position: 'absolute',
    zIndex: -100,
    top: 0,
    left: '-10%',
    opacity: 0.02,
  },
  runningContainer: {
    position: 'absolute',
    top: '30%',
    left: '0%',
    width: '100%',
    opacity: 0.2,
  },
  run: {
    height: normalize.width(10),
    width: normalize.width(10),
    left: '35%',
    opacity: 0.3,
  },
});

export default HomeBackground;
