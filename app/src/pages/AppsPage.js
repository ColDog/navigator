import React from 'react';
import { route } from '../router';
import { connect } from 'react-redux';
import { appsRequest } from '../api/apps';
import Header from '../components/Header';
import Main from '../components/Main';
import { List, Container, Segment } from 'semantic-ui-react';
import capitalize from 'lodash/capitalize';

class Apps extends React.Component {
  static route = '/';

  static mapStateToProps(state) {
    return {
      apps: Object.keys(state.apps.data)
        .map(id => state.apps.data[id])
        .sort((a, b) => a.name > b.name),
    };
  }

  componentWillMount() {
    this.props.dispatch(appsRequest());
  }

  render() {
    const { apps } = this.props
    return (
      <Main>
        <Header />
        <Container style={{paddingTop: 20}}>
          <Segment>
        <List divided={true} relaxed={true}>
          {apps.map(app =>
            <List.Item key={app.id}>
              <List.Icon name="circle" size="large" verticalAlign="middle"></List.Icon>
              <List.Content>
                <List.Header href={`/apps/${app.name}`}>{capitalize(app.name)}</List.Header>
                <List.Description>Updated 10 minutes ago</List.Description>
              </List.Content>
            </List.Item>
          )}
        </List>
        </Segment>
        </Container>
      </Main>
    );
  }
}

export default route(Apps.route, connect(Apps.mapStateToProps)(Apps));
