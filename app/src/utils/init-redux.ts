import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import reducers from '../services';

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware();
    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;
      middlewares.concat(createDebugger());
    }
    return middlewares;
  },
});

export default store;
