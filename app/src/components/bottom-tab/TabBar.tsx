import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import DashboardSvg from '../../assets/DashboardSvg';
import { IndexStackList } from '../../screens/types';
import { Colors, TabBarHiddenScreens, rgba } from '@app/utils';
import { moderateScale } from '../tools/StyleConstants';
import Tab from './Tab';
import GearSvg from '../../assets/GearSvg';
import { HomeStackScreens } from '../../screens/home/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsStackScreens } from '../../screens/settings/types';
import { NetworkStackScreens } from '../../screens/network/types';
import { ProgramStackScreens } from '../../screens/program/types';
import Icon from '@app/icons';
import DemoArrow from '../elements/DemoArrow';
import { DemoStates } from '@app/services';

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

  // const clearCache = async () => {
  //   try {
  //     await axios.get(SERVERURL + '/clear-cache');
  //     setBanner('Cache Cleared');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const isHiddenScreen = (() => {
    const navigationState = navigation.getState();
    const parentIndex = navigationState.index;
    const parentActive = navigationState.routes[parentIndex];
    if (!parentActive) return false;
    const childIndex = parentActive.state?.index;
    if (childIndex === undefined) return false;
    const child = parentActive.state?.routes[childIndex];
    if (!child) return false;
    if (TabBarHiddenScreens.has(child.name)) return true;
    return false;
  })();

  const isActive = useCallback(
    (val: string) => state.routes[state.index].name === val,
    [state],
  );

  if (isHidden) return null;

  return (
    <SafeAreaView
      style={[styles.container, { bottom: isHiddenScreen ? -100 : 0 }]}
      edges={['bottom', 'left', 'right']}>
      <DemoArrow
        state={[
          DemoStates.PROGRAMS,
          DemoStates.BOTTOM_NAV,
          DemoStates.SOCIAL,
          DemoStates.SETTINGS,
          DemoStates.PERSONAL,
        ]}
      />
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
          <Icon
            size={22}
            icon="folder"
            color={
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
          <Icon
            size={22}
            icon="world"
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
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#140000',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: moderateScale(15),
    opacity: 1,
    borderTopWidth: 1,
    borderTopColor: rgba(Colors.whiteRbg, 0.5),
  },
});
export default TabBar;
