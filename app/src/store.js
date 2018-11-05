import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import * as router from './router';
import * as apps from './api/apps';

const devtools =
  typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f;

const store = createStore(
  combineReducers({
    router: router.reducer,
    apps: apps.reducer,
  }),
  {},
  compose(
    applyMiddleware(createLogicMiddleware([...apps.logic])),
    devtools
  )
);

export default store;
