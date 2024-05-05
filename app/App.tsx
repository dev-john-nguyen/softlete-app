import React from 'react';
import { LogBox, StatusBar, View } from 'react-native';
import Home from './src';
import { Provider } from 'react-redux';
import reducers from './src/services';
import store from './src/utils/init-redux';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import axiosRetry from 'axios-retry';

async function resetAuthHeader() {
  const user = auth().currentUser;

  if (!user) return false;

  const newAuthToken = await user.getIdToken();

  // set new auth token in the header
  axios.defaults.headers.common.Authorization = `Bearer ${newAuthToken}`;
  return true;
}

// axios retry configuration
axiosRetry(axios, {
  retries: 3,
  retryCondition: (error: any) => {
    console.error(error);
    const { data } = error.response;
    if (data.tokenExpired) {
      // token expired. Try to reapply
      return resetAuthHeader();
    }
    return false;
  },
});

// useQuery retry configuration - This might not be needed since I'm implementing retries in axios itself
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 3000,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.error(error);
      const { data } = error.response;
      if (data.tokenExpired) {
        // token expired. Try to reapply
        resetAuthHeader();
      }
    },
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof reducers>;

LogBox.ignoreLogs([
  'Warning: Function components cannot be given refs',
  'Could not locate shadow',
  'Sending `healthKit',
]);

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={backgroundStyle}>
            <StatusBar barStyle={'light-content'} />
            <Home />
          </View>
        </GestureHandlerRootView>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
