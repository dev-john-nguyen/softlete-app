import { FlexBox } from '@app/ui';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

const UnderLay = () => {
  const navigation = useNavigation();
  return (
    <FlexBox
      onPress={() => navigation.goBack()}
      height="100%"
      width="100%"
      position="absolute"
      zIndex={0}
      column
    />
  );
};

export default UnderLay;
