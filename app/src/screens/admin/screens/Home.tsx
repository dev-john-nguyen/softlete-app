import React from 'react';
import { AdminStackList } from './types';
import PrimaryText from '../../../components/elements/PrimaryText';
import { PickerButton, ScreenTemplate } from '@app/elements';
import { IndexStackList } from 'src/screens/types';
import { SettingsStackScreens } from 'src/screens/settings/types';

interface Props {
  navigation: any;
}

const AdminHome = ({ navigation }: Props) => {
  const onNavigateToExercises = () => {
    navigation.navigate(AdminStackList.AdminExercises);
  };

  const onBackHandler = () => {
    navigation.navigate(IndexStackList.SettingsStack, {
      screen: SettingsStackScreens.Settings,
    });
  };

  return (
    <ScreenTemplate applyContentPadding isBackVisible onGoBack={onBackHandler}>
      <PrimaryText size="large" marginTop={5}>
        Admin
      </PrimaryText>
      <PickerButton
        borderRadius={100}
        onPress={onNavigateToExercises}
        containerStyles={{ marginTop: 10 }}
        arrow>
        Exercises
      </PickerButton>
    </ScreenTemplate>
  );
};

export default AdminHome;
