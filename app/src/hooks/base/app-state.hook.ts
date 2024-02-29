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
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return { appState };
}
