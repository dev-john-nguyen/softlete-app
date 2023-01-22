import React from 'react';
import { LogBox, StatusBar, useColorScheme, View } from 'react-native';
import Home from './src';
import { Provider } from 'react-redux';
import reducers from './src/services';
import store from './src/utils/init-redux';

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof reducers>

LogBox.ignoreLogs(['Warning: Function components cannot be given refs', 'Could not locate shadow', "Sending `healthKit"])

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1
  };

  return (
    <Provider store={store}>
      <View style={backgroundStyle}>
        <StatusBar barStyle={'light-content'} />
        <Home />
      </View>
    </Provider>
  );
};

export default App;
