import React from 'react';
import { Menu } from 'semantic-ui-react';

const styles = {
  container: {
    backgroundColor: '#efefef',
    paddingTop: 20,
    marginBottom: 20,
  },
  menu: { paddingLeft: 20 },
};

export default ({ name, active }) => (
  <div style={styles.container}>
    <Menu pointing secondary style={styles.menu}>
      <Menu.Item
        name="pipeline"
        active={active === 'pipeline'}
        href={`/apps/${name}`}
      />
      <Menu.Item
        name="settings"
        active={active === 'settings'}
        href={`/apps/${name}/settings`}
      />
    </Menu>
  </div>
);
