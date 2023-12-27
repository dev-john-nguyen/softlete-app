import notifee, { IOSAuthorizationStatus } from '@notifee/react-native';

export const notifyHandler = async () => {
  const settings = await notifee.getNotificationSettings();
  if (settings.authorizationStatus >= IOSAuthorizationStatus.AUTHORIZED) {
    notifee.displayNotification({
      title: 'Workout Timer Finished!',
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
        },
        sound: 'default',
      },
    });
    return true;
  }
  return false;
};

export function secondsToTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) {
    // Handle invalid input
    return {
      hrs: 0,
      mins: 0,
      secs: 0,
    };
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hrs: hours,
    mins: minutes,
    secs: remainingSeconds,
  };
}
