import React from 'react';
import { route } from '../router';
import { connect } from 'react-redux';
import { logsWatcher, logsAborted } from '../api/logs';
import { appsRequest } from '../api/apps';
import Heading from '../components/Header';
import Main from '../components/Main';
import AppMenu, { Divider, Section } from '../components/AppMenu';
import {
  Table,
  Container,
  Loader,
  Grid,
  Segment,
  Header,
} from 'semantic-ui-react';
import capitalize from 'lodash/capitalize';
import Console from '../components/Console';
import moment from 'moment';

class Logs extends React.Component {
  static route = '/logs/:id';
  static mapStateToProps(state) {
    return {
      releaseId: state.router.params.id,
      release: state.logs.data[state.router.params.id],
    };
  }

  componentWillMount() {
    this.props.dispatch(appsRequest());
    this.props.dispatch(logsWatcher(this.props.releaseId));
  }

  componentWillUnmount() {
    this.props.dispatch(logsAborted(this.props.releaseId));
  }

  render() {
    const { release } = this.props;
    if (!release) {
      return (
        <Main>
          <Heading />
          <Loader active />
        </Main>
      );
    }

    return (
      <Main>
        <Heading />
        <AppMenu>
          <Section href="/">Apps</Section>
          <Divider>/</Divider>
          <Section href={`/apps/${release.app}`}>
            {capitalize(release.app)}
          </Section>
          <Divider>/</Divider>
          <Section href={`/apps/${release.app}`}>
            {capitalize(release.stage)}
          </Section>
          <Divider>/</Divider>
          <Section active>Version: {release.version}</Section>
        </AppMenu>

        <Container style={{ paddingTop: 20 }}>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column width={4}>
                <Table>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Application:</Table.Cell>
                      <Table.Cell>{release.app}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Stage:</Table.Cell>
                      <Table.Cell>{release.stage}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Version:</Table.Cell>
                      <Table.Cell>{release.version}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Released:</Table.Cell>
                      <Table.Cell>
                        {moment(release.created).fromNow()}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                <Header>Canary</Header>
                {!release.canary && <p>Not enabled</p>}

                {release.canary && (
                  <Table>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Enabled:</Table.Cell>
                        <Table.Cell>
                          {release.canary ? 'true' : 'false'}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Weight:</Table.Cell>
                        <Table.Cell>{release.canary.weight}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Version:</Table.Cell>
                        <Table.Cell>{release.canary.version}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                )}
              </Grid.Column>

              <Grid.Column width={12}>
                {release.status === 'FAILED' && (
                  <Segment color="red" inverted>
                    Release Failed
                  </Segment>
                )}
                <Console logs={release.logs} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Main>
    );
  }
}

export default route(Logs.route, connect(Logs.mapStateToProps)(Logs));
