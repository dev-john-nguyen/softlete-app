import { Input, PrimaryButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  Colors,
  Fonts,
  moderateScale,
  normalize,
  StyleConstants,
} from '@app/utils';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';

interface FormContainerProps {
  children: any;
  title: string;
  onSave: () => void;
  onClose?: () => void;
}

const FormContainer: FC<FormContainerProps> = ({
  children,
  title,
  onSave,
  onClose,
}) => {
  return (
    <FlexBox column width="100%">
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        marginBottom={10}>
        <PrimaryText size="medium">{title}</PrimaryText>
      </FlexBox>
      {children}
      <FlexBox justifyContent="space-between" marginTop={15}>
        <PrimaryButton onPress={onClose} variant="secondary">
          Cancel
        </PrimaryButton>
        <PrimaryButton onPress={onSave}>Save</PrimaryButton>
      </FlexBox>
    </FlexBox>
  );
};

interface BaseFormProps {
  onChange: (txt: string) => void;
  value: string;
  placeholder: string;
  title: string;
  label: string;
  onClose: () => void;
}

export const BaseForm = ({
  onChange,
  value,
  placeholder,
  title,
  label,
  onClose,
}: BaseFormProps) => {
  const [newValue, setNewValue] = useState(value);
  const setBanner = useBanner();

  const onSave = () => {
    if (!parseFloat(newValue)) {
      setBanner(
        'The measurement must be a number. Please try again.',
        BannerTypes.warning,
      );
      return;
    }
    onChange(newValue);
    onClose();
  };

  return (
    <FormContainer title={title} onSave={onSave} onClose={onClose}>
      <Input
        value={newValue}
        onChangeText={val => setNewValue(val)}
        placeholder={placeholder}
        keyboardType="numeric"
        maxLength={5}
        label={label}
      />
    </FormContainer>
  );
};

interface DurationFormProps {
  onDurationUpdate: (num: number) => void;
  onClose: () => void;
}

export const DurationForm = ({
  onDurationUpdate,
  onClose,
}: DurationFormProps) => {
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);

  const onSave = () => {
    const ms = (hours * 60 * 60 + mins * 60) * 1000;
    onDurationUpdate(ms);
    onClose();
  };

  return (
    <FormContainer onClose={onClose} title="Duration" onSave={onSave}>
      <FlexBox>
        <FlexBox flex={1} column marginRight={10}>
          <PrimaryText marginBottom={5}>Hours</PrimaryText>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.itemStyle}
            enabled={false}
            selectedValue={hours}
            onValueChange={(itemValue: number) => setHours(itemValue)}>
            {new Array(24).fill('').map((_, i) => (
              <Picker.Item value={i} key={i} label={i.toString()} />
            ))}
          </Picker>
        </FlexBox>
        <FlexBox flex={1} column>
          <PrimaryText marginBottom={5}>Minutes</PrimaryText>
          <Picker
            style={styles.pickerStyle}
            itemStyle={styles.itemStyle}
            enabled={false}
            selectedValue={mins}
            onValueChange={(itemValue: number) => setMins(itemValue)}>
            {new Array(60).fill('').map((_, i) => (
              <Picker.Item value={i} key={i} label={i.toString()} />
            ))}
          </Picker>
        </FlexBox>
      </FlexBox>
    </FormContainer>
  );
};

interface Props {
  onChangeDistance: (txt: string) => void;
  distance: string;
  disPlaceHolder: string;
  onClose: () => void;
}

export const MeasForm = ({
  onChangeDistance,
  distance,
  disPlaceHolder,
  onClose,
}: Props) => {
  const [newDis, setNewDis] = useState(distance);
  const setBanner = useBanner();

  const onSave = () => {
    // validate value that it's a number
    if (!parseFloat(newDis)) {
      setBanner(
        'The measurement must be a number. Please try again.',
        BannerTypes.warning,
      );
      return;
    }
    onChangeDistance(newDis);
    onClose();
  };

  return (
    <FormContainer title="Distance" onSave={onSave} onClose={onClose}>
      <Input
        value={newDis}
        onChangeText={val => setNewDis(val)}
        styles={{ marginBottom: StyleConstants.smallMargin }}
        placeholder={disPlaceHolder}
        keyboardType="numeric"
        maxLength={4}
        label="Miles"
      />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  pickerStyle: {
    width: '100%',
    borderRadius: StyleConstants.borderRadius,
    borderColor: Colors.white,
    borderWidth: 1,
  },
  itemStyle: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.secondary,
    color: Colors.white,
    textTransform: 'capitalize',
    height: normalize.height(15),
  },
  label: {
    fontSize: StyleConstants.extraSmallFont,
    marginBottom: 10,
    color: Colors.lightWhite,
  },
});
