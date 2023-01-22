import React from 'react';
import {View, StyleSheet} from 'react-native';
import {normalize} from '../../utils/tools';
import BaseColors, {rgba} from '../../utils/BaseColors';
import PrimaryText from './PrimaryText';
import SecondaryText from './SecondaryText';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface Props {
  onDeny: () => void;
  onConfirm: () => void;
  header: string;
  body?: string;
}

const Modal = ({onConfirm, onDeny, header, body}: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.content, BaseColors.primaryBoxShadow]}>
        <PrimaryText styles={styles.header}>{header}</PrimaryText>
        <SecondaryText styles={styles.body}>{body}</SecondaryText>
        <View style={styles.btnContainer}>
          <PrimaryButton onPress={onConfirm} styles={styles.btn}>
            Yes
          </PrimaryButton>
          <SecondaryButton onPress={onDeny} styles={styles.btn}>
            No
          </SecondaryButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: rgba(BaseColors.lightWhiteRgb, 0.9),
    zIndex: 100,
  },
  content: {
    padding: 30,
    margin: 20,
    backgroundColor: BaseColors.white,
    borderRadius: 10,
    top: '-10%',
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '25%',
    margin: 10,
  },
  header: {
    fontSize: normalize.width(25),
  },
  body: {
    fontSize: normalize.width(30),
  },
});
export default Modal;
