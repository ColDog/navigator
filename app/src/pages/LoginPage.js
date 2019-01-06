import React from "react";
import { route } from "../router";
import { connect } from "react-redux";
import Header from "../components/Header";
import Main from "../components/Main";
import { Container, Button, Form } from "semantic-ui-react";
import * as router from "../router";

class LoginForm extends React.Component {
  state = { email: "", password: "" };

  handleFieldChange(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  handleSubmit = () => this.props.onSubmit(this.state);

  render() {
    return (
      <Form size="large" onSubmit={this.handleSubmit}>
        <Form.Input
          fluid
          onChange={this.handleFieldChange.bind(this, "email")}
          icon="user"
          iconPosition="left"
          placeholder="E-mail address"
        />
        <Form.Input
          fluid
          onChange={this.handleFieldChange.bind(this, "password")}
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          type="password"
        />

        <Button color="blue" fluid size="large">
          Login
        </Button>
      </Form>
    );
  }
}

class LoginPage extends React.Component {
  static route = "/login";

  static mapStateToProps(state) {
    return {};
  }

  handleSubmit = user => {
    localStorage.setItem(
      "authorization",
      `Basic ${btoa(`${user.email}:${user.password}`)}`,
    );
    router.go("/");
  };

  render() {
    return (
      <Main>
        <Header />
        <Container style={{ paddingTop: 20 }}>
          <LoginForm onSubmit={this.handleSubmit} />
        </Container>
      </Main>
    );
  }
}

export default route(
  LoginPage.route,
  connect(LoginPage.mapStateToProps)(LoginPage),
);
