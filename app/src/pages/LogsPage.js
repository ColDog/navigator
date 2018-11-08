import React from 'react';
import { route } from '../router';
import { connect } from 'react-redux';
import { tail } from '../api/logs';
import Header from '../components/Header';
import Main from '../components/Main';
import { Container, Segment } from 'semantic-ui-react';

class Logs extends React.Component {
  static route = '/logs/:id';

  static mapStateToProps(state) {
    return {
      releaseId: state.router.params.id,
      logs: state.logs.data[state.router.params.id],
    };
  }

  cancel = null;

  componentWillMount() {
    this.cancel = tail(this.props.dispatch, this.props.releaseId);
  }

  componentWillUnmount() {
    this.cancel && this.cancel();
  }

  render() {
    const { logs } = this.props;
    if (!logs) {
      return <div></div>
    }
    return (
      <Main>
        <Header />
        <Container style={{ paddingTop: 20 }}>
          <Segment>
            <pre>
              <code>
                {logs.join('\n')}
              </code>
            </pre>
          </Segment>
        </Container>
      </Main>
    );
  }
}

export default route(Logs.route, connect(Logs.mapStateToProps)(Logs));
