import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { start } from './router';

import { AppPage, AppsPage, AppSettingsPage } from './pages'

import 'semantic-ui-css/semantic.min.css';

const App = () => (
  <Provider store={store}>
    <div>
      <AppPage />
      <AppsPage />
      <AppSettingsPage />
    </div>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

start(store);
