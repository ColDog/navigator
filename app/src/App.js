import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import {
  AppPage,
  AppsPage,
  AppSettingsPage,
  AppEventsPage,
  LogsPage,
  LoginPage,
} from "./pages";

const App = () => (
  <Provider store={store}>
    <div>
      <AppPage />
      <AppsPage />
      <AppSettingsPage />
      <AppEventsPage />
      <LogsPage />
      <LoginPage />
    </div>
  </Provider>
);

export default App;
