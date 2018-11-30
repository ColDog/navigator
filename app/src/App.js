import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import {
  AppPage,
  AppsPage,
  AppSettingsPage,
  AppEventsPage,
  LogsPage,
} from "./pages";

const App = () => (
  <Provider store={store}>
    <div>
      <AppPage />
      <AppsPage />
      <AppSettingsPage />
      <AppEventsPage />
      <LogsPage />
    </div>
  </Provider>
);

export default App;
