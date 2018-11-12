import React from 'react';
import { route } from '../router';
import { connect } from 'react-redux';
import { tail } from '../api/logs';
import { appsRequest } from '../api/apps';
import Heading from '../components/Header';
import Main from '../components/Main';
import AppMenu, { Divider, Section } from '../components/AppMenu';
import {
  Header,
  Table,
  Container,
  Segment,
  Loader,
  Grid,
  Icon,
} from 'semantic-ui-react';
import capitalize from 'lodash/capitalize';

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
    this.cancel = tail(this.props.dispatch, this.props.releaseId);
  }

  componentWillUnmount() {
    this.cancel && this.cancel();
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

    const lines = release.logs.map(l => '[' + l.created + '] ' + l.line);

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

                <Header>Checks</Header>
                <Table>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Rollback:</Table.Cell>
                      <Table.Cell>
                        <Icon name="check" color="green" />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>My-Name:</Table.Cell>
                      <Table.Cell>
                        <Icon name="x" color="red" />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                <Header>Canary</Header>
                <Table>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Weight:</Table.Cell>
                      <Table.Cell>50%</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Canary:</Table.Cell>
                      <Table.Cell>canary</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Stable:</Table.Cell>
                      <Table.Cell>stable</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                <Header>Links</Header>
                <Table>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell><a href="#">Logs</a></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell><a href="#">Monitoring</a></Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>

              <Grid.Column width={12}>
                <Segment style={{ backgroundColor: 'black', color: 'white', overflow: 'scroll' }}>
                  <pre>
                    <code>{lines.join('\n')}</code>
                  </pre>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Main>
    );
  }
}

export default route(Logs.route, connect(Logs.mapStateToProps)(Logs));
