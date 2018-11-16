import React from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { close } from '../notify';

const mapLevelToColor = level => {
  switch (level) {
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    case 'success':
      return 'green'
    default:
      return null;
  }
};

const styles = {
  container: {
    position: 'fixed',
    left: 20,
    bottom: 20,
    width: 300,
  },
  message: {}
};

class Notification extends React.Component {
  static mapper(state) {
    return { messages: state.notify.data };
  }

  handleDismiss = id => {
    this.props.dispatch(close(id));
  };

  render() {
    const { messages } = this.props;
    return (
      <div style={styles.container}>
        {messages.map(message => (
          <Message
            style={styles.message}
            onDismiss={() => this.handleDismiss(message.id)}
            key={message.id}
            color={mapLevelToColor(message.level)}
            content={message.message}
          />
        ))}
      </div>
    );
  }
}

export default connect(Notification.mapper)(Notification);
