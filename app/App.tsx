import React from 'react';
import { LogBox, StatusBar, View } from 'react-native';
import Home from './src';
import { Provider } from 'react-redux';
import reducers from './src/services';
import store from './src/utils/init-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
        <View style={backgroundStyle}>
          <StatusBar barStyle={'light-content'} />
          <Home />
        </View>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
