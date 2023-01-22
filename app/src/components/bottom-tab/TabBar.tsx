import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import FolderSvg from '../../assets/FolderSvg';
import DashboardSvg from '../../assets/DashboardSvg';
import { IndexStackList } from '../../screens/types';
import { Colors, rgba } from '@app/utils';
import { moderateScale } from '../tools/StyleConstants';
import Tab from './Tab';
import GearSvg from '../../assets/GearSvg';
import { HomeStackScreens } from '../../screens/home/types';
import ConnectionSvg from '../../assets/ConnectionSvg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsStackScreens } from '../../screens/settings/types';
import { NetworkStackScreens } from '../../screens/network/types';
import { ProgramStackScreens } from '../../screens/program/types';

const TabBar = ({
  state,
  navigation,
  isHidden,
}: BottomTabBarProps & { isHidden?: boolean }) => {
  const navToHome = () => {
    if (isActive(IndexStackList.HomeStack)) {
      navigation.navigate(IndexStackList.HomeStack, {
        screen: HomeStackScreens.Home,
      });
    } else {
      navigation.navigate(IndexStackList.HomeStack);
    }
  };
  const navToPrograms = () => {
    if (isActive(IndexStackList.ProgramStack)) {
      navigation.navigate(IndexStackList.ProgramStack, {
        screen: ProgramStackScreens.Program,
      });
    } else {
      navigation.navigate(IndexStackList.ProgramStack);
    }
  };
  const onNavToAthletes = () => {
    if (isActive(IndexStackList.NetworkStack)) {
      navigation.navigate(IndexStackList.NetworkStack, {
        screen: NetworkStackScreens.Maintenance,
      });
    } else {
      navigation.navigate(IndexStackList.NetworkStack);
    }
  };
  const onNavToSettings = () => {
    if (isActive(IndexStackList.SettingsStack)) {
      navigation.navigate(IndexStackList.SettingsStack, {
        screen: SettingsStackScreens.Settings,
      });
    } else {
      navigation.navigate(IndexStackList.SettingsStack);
    }
  };

  const isActive = useCallback(
    (val: string) => state.routes[state.index].name === val,
    [state],
  );

  if (isHidden) return <></>;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Tab
        onPress={navToHome}
        icon={
          <DashboardSvg
            strokeColor={
              isActive(IndexStackList.HomeStack)
                ? Colors.lightWhite
                : rgba(Colors.whiteRbg, 0.1)
            }
          />
        }
        active={isActive(IndexStackList.HomeStack)}
      />

      <Tab
        onPress={navToPrograms}
        icon={
          <FolderSvg
            strokeColor={
              isActive(IndexStackList.ProgramStack)
                ? Colors.lightWhite
                : rgba(Colors.whiteRbg, 0.1)
            }
          />
        }
        active={isActive(IndexStackList.ProgramStack)}
      />

      <Tab
        onPress={onNavToAthletes}
        icon={
          <ConnectionSvg
            color={
              isActive(IndexStackList.NetworkStack)
                ? Colors.lightWhite
                : rgba(Colors.whiteRbg, 0.1)
            }
          />
        }
        active={isActive(IndexStackList.NetworkStack)}
      />

      <Tab
        onPress={onNavToSettings}
        icon={
          <GearSvg
            fillColor={
              isActive(IndexStackList.SettingsStack)
                ? Colors.lightWhite
                : rgba(Colors.whiteRbg, 0.1)
            }
          />
        }
        active={isActive(IndexStackList.SettingsStack)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#250000',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: moderateScale(15),
    opacity: 1,
    borderTopWidth: 1,
    borderTopColor: rgba(Colors.whiteRbg, 0.5),
  },
});
export default TabBar;
