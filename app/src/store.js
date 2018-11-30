import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import { createLogicMiddleware } from "redux-logic";

import * as router from "./router";
import * as notify from "./notify";
import * as apps from "./api/apps";
import * as logs from "./api/logs";

const devtools =
  typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f;

const reducers = {
  router: router.reducer,
  apps: apps.reducer,
  logs: logs.reducer,
  notify: notify.reducer,
};

const logic = [...apps.logic, ...logs.logic, ...notify.logic];

const store = createStore(
  combineReducers(reducers),
  {},
  compose(
    applyMiddleware(createLogicMiddleware(logic)),
    devtools,
  ),
);

export default store;
