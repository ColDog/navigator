import React from "react";
import { route } from "../router";
import { connect } from "react-redux";
import Heading from "../components/Header";
import Main from "../components/Main";
import { appRequest } from "../api/apps";
import { Loader } from "semantic-ui-react";
import AppMenu, { Section, Divider } from "../components/AppMenu";
import { Container, Segment, List } from "semantic-ui-react";
import capitalize from "lodash/capitalize";

class AppEventsPage extends React.Component {
  static route = "/apps/:id/events";
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

    const { name, events } = this.props;
    return (
      <Main>
        <Heading />
        <AppMenu>
          <Section href="/">Apps</Section>
          <Divider />
          <Section href={`/apps/${name}`}>{capitalize(name)}</Section>
          <Divider />
          <Section active>Events</Section>
        </AppMenu>

        <Container style={{ paddingTop: 20 }}>
          <Segment>
            <List celled size="large">
              {events.map(event => (
                <List.Item>
                  <List.Content>
                    <List.Header>
                      {event.name}
                      <span style={{ float: "right" }}>{event.created}</span>
                    </List.Header>
                    <List.Description>
                      <pre>
                        <code>{JSON.stringify(event.payload, null, 2)}</code>
                      </pre>
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Segment>
        </Container>
      </Main>
    );
  }
}

export default route(
  AppEventsPage.route,
  connect(AppEventsPage.mapStateToProps)(AppEventsPage),
);
