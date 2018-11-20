import React from 'react';
import { route } from '../../router';
import { connect } from 'react-redux';
import Heading from '../../components/Header';
import Main from '../../components/Main';
import {
  appWatcher,
  appAborted,
  appReleaseRequest,
  appRemoveRequest,
  appPromoteRequest,
} from '../../api/apps';
import StageList from './StageList';
import { Loader } from 'semantic-ui-react';
import AppMenu, { Divider, Section } from '../../components/AppMenu';
import capitalize from 'lodash/capitalize';

class AppPage extends React.Component {
  static route = '/apps/:id';

  static mapStateToProps(state) {
    return {
      name: state.router.params.id,
      loaded: state.apps.data[state.router.params.id],
      app: state.apps.data[state.router.params.id],
    };
  }

  callbacks = {
    onRemove: (app, stage, version) => {
      this.props.dispatch(appRemoveRequest(app, stage, version));
    },
    onPromote: (app, stage, version, to) => {
      this.props.dispatch(appPromoteRequest(app, stage, version, to));
    },
    onRelease: (app, stage, version, canary) => {
      this.props.dispatch(appReleaseRequest(app, stage, version, canary));
    },
  };

  componentWillMount() {
    this.props.dispatch(appWatcher(this.props.name));
  }

  componentWillUnmount() {
    this.props.dispatch(appAborted(this.props.name));
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

    const { name, app } = this.props;
    return (
      <Main>
        <Heading />
        <AppMenu>
          <Section style={{ float: 'right' }} href={`/apps/${name}/settings`}>
            Config
          </Section>
          <Divider style={{float: 'right'}}>&nbsp;</Divider>
          <Section style={{ float: 'right' }} href={`/apps/${name}/events`}>
            Events
          </Section>
          <Section href="/">Apps</Section>
          <Divider>/</Divider>
          <Section active>{capitalize(name)}</Section>
        </AppMenu>

        <div style={{ padding: 20 }}>
          <StageList
            app={app}
            stages={app.stages || []}
            callbacks={this.callbacks}
          />
        </div>
      </Main>
    );
  }
}

export default route(AppPage.route, connect(AppPage.mapStateToProps)(AppPage));
