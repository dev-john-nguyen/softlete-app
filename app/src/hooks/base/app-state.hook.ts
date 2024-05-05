import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState<{ appState: AppStateStatus }>({
    appState: 'active',
  });

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState({ appState: nextAppState });
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return { appState };
}
