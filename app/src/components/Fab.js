import React from 'react';
import { Button } from 'semantic-ui-react';

const styles = {
  container: { position: 'fixed', right: 20, bottom: 20 },
};

export default props => (
  <div style={styles.container}>
    <Button basic circular floated="right" {...props} />
  </div>
);
