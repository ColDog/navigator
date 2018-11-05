import React from 'react';
import { route } from '../router';
import { connect } from 'react-redux';
import Heading from '../components/Header';
import Main from '../components/Main';
import { appRequest, appSaveRequest } from '../api/apps';
import { Loader } from 'semantic-ui-react';
import AppMenu from '../components/AppMenu';
import { Form, TextArea, Container, Button } from 'semantic-ui-react';
import SettingsForm from '../components/SettingsForm';

class AppSettingsPage extends React.Component {
  static route = '/apps/:id/settings';
  state = { value: null };

  static mapStateToProps(state) {
    return {
      name: state.router.params.id,
      ...state.apps.data[state.router.params.id],
    };
  }

  componentWillMount() {
    this.props.dispatch(appRequest(this.props.name));
  }

  handleSave = () => {
    if (this.state.value) {
      try {
        const manifest = JSON.parse(this.state.value);
        this.props.dispatch(appSaveRequest(manifest));
      } catch (e) {
        // Ignore.
      }
    }
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { loaded } = this.props;
    if (!loaded) {
      return (
        <Main>
          <Heading />
          <Loader active />
        </Main>
      );
    }

    const { value } = this.state;
    const { name, manifest } = this.props;
    return (
      <Main>
        <Heading />
        <AppMenu name={name} active="settings" />

        <Container>
          <SettingsForm
            value={value}
            manifest={manifest}
            onSave={this.handleSave}
            onChange={this.handleChange}
          />
        </Container>
      </Main>
    );
  }
}

export default route(
  AppSettingsPage.route,
  connect(AppSettingsPage.mapStateToProps)(AppSettingsPage)
);
