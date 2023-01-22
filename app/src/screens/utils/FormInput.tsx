import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import Input from '../../components/elements/Input';
import SecondaryText from '../../components/elements/SecondaryText';
import StyleConstants from '../../components/tools/StyleConstants';
import { capitalize } from '../../utils/tools';
import BackButton from '../../components/elements/BackButton';
import ScreenTemplate from '../../components/elements/ScreenTemplate';

interface Props {
  route: any;
  navigation: any;
}

const FormInput = ({ route, navigation }: Props) => {
  const [value, setValue] = useState('');
  const [des, setDes] = useState('');
  const [mult, setMult] = useState(false);
  const [maxLength, setMaxLength] = useState(200);
  const ref: any = useRef();

  const onNavigateBack = () => {
    if (!route || !route.params || !route.params.goBackScreen)
      return navigation.goBack();
    navigation.navigate(route.params.goBackScreen, {
      label: route.params ? route.params.label : 'label',
      value,
    });
  };

  useEffect(() => {
    if (!route || !route.params) {
      navigation.goBack();
      return;
    }

    const {
      value: paramsValue,
      des: paramsDes,
      mult: paramsMult,
      maxLength: paramsMaxLength,
    } = route.params;
    setMult(paramsMult);
    setValue(paramsValue);
    setDes(paramsDes);
    setMaxLength(paramsMaxLength);
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params ? capitalize(route.params.label) : 'label',
      headerLeft: () => {
        return <BackButton onPress={onNavigateBack} rotateBack="0" />;
      },
    });
    ref.current?.focus();
  }, [navigation, route, value]);

  return (
    <ScreenTemplate headerPadding>
      <View style={styles.container}>
        <Input
          value={value}
          onChangeText={txt => setValue(txt)}
          styles={{ borderRadius: 0 }}
          multiline={mult}
          maxLength={maxLength}
          inputRef={ref}
        />
        <SecondaryText styles={styles.des}>{des}</SecondaryText>
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StyleConstants.baseMargin,
  },
  des: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.lightWhite,
    margin: StyleConstants.baseMargin,
    marginTop: StyleConstants.smallMargin,
  },
});
export default FormInput;
