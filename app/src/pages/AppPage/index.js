import React from 'react';
import { route } from '../../router';
import { connect } from 'react-redux';
import Heading from '../../components/Header';
import Main from '../../components/Main';
import { appRequest, appReleaseRequest, appRemoveRequest, appPromoteRequest } from '../../api/apps';
import StageList from './StageList';
import { Loader, Menu, Container, Header } from 'semantic-ui-react';
import AppMenu from '../../components/AppMenu';
import { poller } from '../../api/fetch'

class AppPage extends React.Component {
  static route = '/apps/:id';

  static mapStateToProps(state) {
    return {
      name: state.router.params.id,
      loaded: state.apps.data[state.router.params.id],
      app: state.apps.data[state.router.params.id],
    };
  }

  cancel = null;

  callbacks = {
    onRemove: (app, stage, version) => {
      this.props.dispatch(appRemoveRequest(app, stage, version))
    },
    onPromote: (app, stage, version, to) => {
      this.props.dispatch(appPromoteRequest(app, stage, version, to))
    },
    onRelease: (app, stage, version) => {
      this.props.dispatch(appReleaseRequest(app, stage, version))
    },
  }

  componentWillMount() {
    this.props.dispatch(appRequest(this.props.name));
    // this.cancel = poller(1000, () => {
    //   this.props.dispatch(appRequest(this.props.name));
    // })
  }

  componentWillUnmount() {
    // this.cancel && this.cancel()
  }

  render() {
    const { loaded } = this.props
    if (!loaded) {
      return (
        <Main>
          <Heading />
          <Loader active />
        </Main>
      );
    }

    const { name, app } = this.props
    return (
      <Main>
        <Heading />
        <AppMenu name={name} active="pipeline" />
        <div style={{padding: 20}}>
          <StageList app={app} stages={app.stages} callbacks={this.callbacks} />
        </div>
      </Main>
    );
  }
}

export default route(
  AppPage.route,
  connect(AppPage.mapStateToProps)(AppPage)
);
