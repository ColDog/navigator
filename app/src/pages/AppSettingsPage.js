import React from 'react';
import { route } from '../router';
import { connect } from 'react-redux';
import Heading from '../components/Header';
import Main from '../components/Main';
import { appRequest } from '../api/apps';
import { Loader } from 'semantic-ui-react';
import AppMenu, { Section, Divider } from '../components/AppMenu';
import { Container, Segment } from 'semantic-ui-react';
import capitalize from 'lodash/capitalize';

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

    const { name, manifest } = this.props;
    return (
      <Main>
        <Heading />
        <AppMenu>
          <Section href="/">Apps</Section>
          <Divider />
          <Section href={`/apps/${name}`}>{capitalize(name)}</Section>
          <Divider />
          <Section active>Settings</Section>
        </AppMenu>

        <Container style={{ paddingTop: 20 }}>
          <Segment inverted>
            <pre>
              <code>{JSON.stringify(manifest, null, 2)}</code>
            </pre>
          </Segment>
        </Container>
      </Main>
    );
  }
}

export default route(
  AppSettingsPage.route,
  connect(AppSettingsPage.mapStateToProps)(AppSettingsPage)
);
