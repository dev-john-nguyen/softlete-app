import { useEffect, useState } from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { SET_OFFLINE } from '../../services/global/actionTypes';
import notifee from '@notifee/react-native';
import { AppDispatch } from '../../../App';
import { UserProps } from '../../services/user/types';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import PATHS, { SERVERURL } from '../../utils/PATHS';
import auth from '@react-native-firebase/auth';

export function useNetInfo(dispatch: AppDispatch) {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.type === NetInfoStateType.none) {
        dispatch({ type: SET_OFFLINE });
      } else {
        // dispatch({ type: SET_ONLINE })
      }
    });

    notifee.setBadgeCount(0).catch(err => console.log(err));

    return () => {
      unsubscribe();
    };
  }, []);
}

export function useUserPermission(user: UserProps) {
  // const initIAP = async () => {
  //     try {
  //         await IAP.connectAsync().then((res) => {
  //             console.log(res)
  //             dispatch({ type: SET_CONNECT_APP_STORE })
  //         })

  //         IAP.setPurchaseListener(async ({ responseCode, results, errorCode }) => {
  //             // Purchase was successful
  //             if (responseCode === IAP.IAPResponseCode.OK) {

  //                 if (!results || !user.uid) return;

  //                 for (let i = 0; i < results.length; i++) {
  //                     const purchase: IAP.InAppPurchase = results[i];

  //                     if (!purchase.acknowledged && purchase.transactionReceipt) {
  //                         // Process transaction here and unlock content...
  //                         // await subscriptionPurchased(purchase.productId, purchase.purchaseTime, purchase.originalOrderId ? purchase.originalOrderId : purchase.orderId)
  //                         await handleSubscriptionPurchased(purchase.transactionReceipt, purchase.originalOrderId ? purchase.originalOrderId : purchase.orderId, purchase.productId)
  //                         // Then when you're done
  //                         IAP.finishTransactionAsync(purchase, true);
  //                     }

  //                 }

  //                 return;
  //             }

  //             // Else find out what went wrong
  //             if (responseCode === IAP.IAPResponseCode.USER_CANCELED) {
  //                 console.log('warning', 'You canceled the transaction');
  //             } else if (responseCode === IAP.IAPResponseCode.DEFERRED) {
  //                 console.log('warning', 'You do not have permissions to buy but requested parental approval (iOS only)');
  //             } else {
  //                 console.log('error', `Something went wrong with the purchase. Received errorCode ${errorCode}`);
  //             }
  //         });

  //     } catch (err) {
  //         console.log(err)
  //     }
  // }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // get  the token
      const fcmToken = await messaging().getToken();
      if (fcmToken && fcmToken !== user.notificationToken) {
        await axios
          .post(SERVERURL + PATHS.user.token, { notificationToken: fcmToken })
          .then(() => console.log('token saved'));
      }
    }
  };

  useEffect(() => {
    if (user.uid) {
      // initIAP()
      requestUserPermission().catch(err => console.log(err));
    }
  }, [user.uid]);
}

export function useAuth(login: any, logout: any) {
  const [loading, setLoading] = useState(false);
  const [verify, setVerfiy] = useState(false);

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(async authUser => {
      setLoading(true);
      console.log(authUser);
      if (authUser) {
        if (authUser.emailVerified) {
          //login
          setVerfiy(false);
          await authUser
            .getIdToken()
            .then(token => login(token))
            .catch(err => {
              console.log(err);
              login('');
            });
        } else {
          //complete login process
          setVerfiy(true);
        }
      } else {
        setVerfiy(false);
        logout();
      }
      setLoading(false);
    });

    return () => {
      subscribe();
    };
  }, []);

  return {
    loading,
    verify,
  };
}
