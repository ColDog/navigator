import React from 'react';
import { Container, Dropdown, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';

const Heading = ({ apps }) => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item href="/" as="a" header>
        Navigator
      </Menu.Item>

      <Dropdown item simple text="Apps">
        <Dropdown.Menu>
          {apps.map(app => (
            <Dropdown.Item key={app.id} href={`/apps/${app.name}`}>
              {app.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  </Menu>
);

export default connect(state => ({
  apps: Object.keys(state.apps.data)
    .map(id => state.apps.data[id])
    .sort((a, b) => a.name > b.name),
}))(Heading);
