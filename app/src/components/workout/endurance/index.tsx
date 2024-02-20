import { useWorkoutState } from '@app/contexts';
import { FlexBox } from '@app/ui';
import React, { useEffect, useState } from 'react';
import EnduranceForm from './components/EnduranceForm';
import EnduranceSummary from './components/EnduranceSummary';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { ChevronNavigationButton, PrimaryText } from '@app/elements';
import { HomeStackParamsList, HomeStackScreens } from 'src/screens/home/types';
import { useNavigation } from '@react-navigation/native';

const EnduranceWrapper = () => {
  const { workout } = useWorkoutState();
  const [edit, setEdit] = useState(false);
  const navigation = useNavigation<HomeStackParamsList>();
  const hasHealthData = Boolean(workout.healthData);

  useEffect(() => {
    setEdit(hasHealthData ? false : true);
  }, [hasHealthData]);

  const onChangeEditHandler = () => {
    setEdit(editState => {
      if (editState) {
        return hasHealthData ? false : true;
      }
      return !editState;
    });
  };

  const onNavToMapView = () => {
    if (workout.healthData) {
      navigation.push(HomeStackScreens.Map, { data: workout.healthData });
    }
  };

  return (
    <FlexBox column flex={1} zIndex={100} margin={15} marginTop={10}>
      {hasHealthData ? (
        edit ? (
          <ChevronNavigationButton
            right
            onPress={onChangeEditHandler}
            label="View Summary"
          />
        ) : (
          <FlexBox
            marginBottom={10}
            justifyContent="space-between"
            alignItems="center">
            <ChevronNavigationButton
              onPress={onChangeEditHandler}
              label="Edit Summary"
            />
            {hasHealthData && (
              <FlexBox
                onPress={onNavToMapView}
                borderWidth={1}
                borderColor={Colors.white}
                padding={6}
                paddingRight={15}
                paddingLeft={15}
                borderRadius={100}>
                <PrimaryText marginRight={5}>View Map</PrimaryText>
                <Icon icon="compass" size={20} color={Colors.white} />
              </FlexBox>
            )}
          </FlexBox>
        )
      ) : null}
      {edit ? <EnduranceForm setEdit={setEdit} /> : <EnduranceSummary />}
    </FlexBox>
  );
};

export default EnduranceWrapper;
