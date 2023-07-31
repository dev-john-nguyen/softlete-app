import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import reducers from '../services';

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 },
    });
    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;
      middlewares.concat(createDebugger());
    }
    return middlewares;
  },
});

export default store;
