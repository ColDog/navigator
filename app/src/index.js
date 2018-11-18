import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import * as router from './router';
import {
  AppPage,
  AppsPage,
  AppSettingsPage,
  AppEventsPage,
  LogsPage,
} from './pages';

import 'semantic-ui-css/semantic.min.css';

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

ReactDOM.render(<App />, document.getElementById('root'));

router.start(store);
