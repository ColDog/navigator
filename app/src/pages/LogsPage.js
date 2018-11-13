import React from 'react';
import { route } from '../router';
import { connect } from 'react-redux';
import { logsRequest } from '../api/logs';
import { appsRequest } from '../api/apps';
import Heading from '../components/Header';
import Main from '../components/Main';
import AppMenu, { Divider, Section } from '../components/AppMenu';
import { Table, Container, Loader, Grid, Segment } from 'semantic-ui-react';
import capitalize from 'lodash/capitalize';
import Console from '../components/Console';
import { poller } from '../api/fetch';

class Logs extends React.Component {
  static route = '/logs/:id';
  static mapStateToProps(state) {
    return {
      releaseId: state.router.params.id,
      release: state.logs.data[state.router.params.id],
    };
  }

  cancel = null;

  componentWillMount() {
    this.props.dispatch(appsRequest());
    this.cancel = poller(1000, `/logs/${this.props.releaseId}`, () => {
      this.props.dispatch(logsRequest(this.props.releaseId));
    });
  }

  componentWillUnmount() {
    if (this.cancel) {
      this.cancel();
    }
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
                      <Table.Cell>{release.created}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
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
