import React from 'react';
import { Segment } from 'semantic-ui-react';
import Convert from 'ansi-to-html';

const convert = new Convert();

const format = line =>
  line === ''
    ? { __html: '<br />' }
    : {
        __html: convert.toHtml(
          line.replace(' ', '&nbsp;').replace('\n', '<br />')
        ),
      };

const styles = {
  container: {
    backgroundColor: 'black',
    color: 'white',
    fontFamily: 'monospace',
    overflow: 'scroll',
  },
  line: { display: 'block', whiteSpace: 'nowrap' },
};

export default ({ logs }) => (
  <Segment style={styles.container}>
    {logs.map(log => (
      <span style={styles.line} dangerouslySetInnerHTML={format(log.line)} />
    ))}
  </Segment>
);
