import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignIn from './screens/signin';
import SettingsStack from './screens/settings';
import { connect } from 'react-redux';
import { ReducerProps } from './services';
import {
  logout,
  login,
  handleSubscriptionPurchased,
} from './services/user/actions';
import Banner from './components/Banner';
import { UserActionProps, UserProps } from './services/user/types';
import { IndexStackParamsList } from './screens/types';
import BaseColors from './utils/BaseColors';
import HomeStack from './screens/home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InitUser from './screens/init';
import NewUserAdvise from './screens/init/NewUserAdvise';
import NetworkStack from './screens/network';
import AdminStack from './screens/admin/screens';
import VerifyEmail from './screens/signin/VerifyEmail';
import HelpStack from './screens/help';
import { navigationRef } from './RootNavigation';
import { AppDispatch } from '../App';
import ProgramStack from './screens/program';
import TabBar from './components/bottom-tab/TabBar';
import Icon from '@app/icons';
import { FlexBox } from './ui';

import {
  useAuth,
  useNetInfo,
  useUserPermission,
} from './hooks/base/base.hooks';

//get health permissions
import './permissions/health';
import PrimaryText from './components/elements/PrimaryText';

const Tab = createBottomTabNavigator<IndexStackParamsList>();

interface Props {
  user: UserProps;
  logout: any;
  login: any;
  isNewUser: boolean;
  handleSubscriptionPurchased: UserActionProps['handleSubscriptionPurchased'];
  dispatch: AppDispatch;
}

const Main = ({
  logout,
  login,
  user,
  isNewUser,
  handleSubscriptionPurchased,
  dispatch,
}: Props) => {
  useNetInfo(dispatch);
  useUserPermission(user);
  const { loading, verify } = useAuth(login, logout);

  return (
    <SafeAreaProvider>
      {loading ? (
        <FlexBox flex={1} justifyContent="center" alignItems="center" column>
          <Icon icon="logo" variant="secondary" size={50} />
          <PrimaryText marginTop={10}>Loading ...</PrimaryText>
        </FlexBox>
      ) : (
        <NavigationContainer
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: 'transparent',
              primary: BaseColors.black,
            },
          }}
          ref={navigationRef}>
          <Tab.Navigator
            screenOptions={() => ({
              headerShown: false,
              drawerPosition: 'right',
            })}
            tabBar={props => (
              <TabBar {...props} isHidden={verify || isNewUser || !user?.uid} />
            )}>
            {verify ? (
              <Tab.Screen name="VerifyEmail" component={VerifyEmail} />
            ) : user.token ? (
              isNewUser ? (
                <>
                  <Tab.Screen name="Init" component={InitUser} />
                  <Tab.Screen name="NewUserAdvise" component={NewUserAdvise} />
                </>
              ) : (
                <>
                  <Tab.Screen
                    name="HomeStack"
                    component={HomeStack}
                    initialParams={user}
                  />
                  <Tab.Screen name="ProgramStack" component={ProgramStack} />
                  <Tab.Screen name="NetworkStack" component={NetworkStack} />
                  <Tab.Screen
                    name="SettingsStack"
                    component={SettingsStack}
                    initialParams={user}
                  />
                  <Tab.Screen name="HelpStack" component={HelpStack} />
                  <Tab.Screen name="AdminStack" component={AdminStack} />
                </>
              )
            ) : (
              <>
                <Tab.Screen name="SignIn" component={SignIn} />
              </>
            )}
          </Tab.Navigator>
        </NavigationContainer>
      )}
      <Banner />
    </SafeAreaProvider>
  );
};

const mapStateToProps = (state: ReducerProps) => ({
  user: state.user,
  isNewUser: state.global.isNewUser,
  notificationToken: state.global.notificationToken,
  register: state.global.register,
});

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(logout()),
  login: (token: string) => dispatch(login(token)),
  handleSubscriptionPurchased: (
    transactionReceipt: string,
    originalOrderId: string,
    productId: string,
  ) =>
    dispatch(
      handleSubscriptionPurchased(
        transactionReceipt,
        originalOrderId,
        productId,
      ),
    ),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
