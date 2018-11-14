import React from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { close, notify } from '../notify';

const mapLevelToColor = level => {
  switch (level) {
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    default:
      return null;
  }
};

const style = {
  container: {
    position: 'fixed',
    left: 20,
    bottom: 20,
  },
};

class Notification extends React.Component {
  static mapper(state) {
    return { message: state.notify.data[0] }
  }

  componentDidUpdate() {
    this.triggerClose()
  }

  triggerClose() {
    if (this.props.message) {
      const id = this.props.message.id;
      setTimeout(() => {
        this.props.dispatch(close(id));
      }, 5000);
    }
  }

  render() {
    const { message } = this.props;
    if (!message) {
      return null;
    }
    return (
      <Message style={style.container} color={mapLevelToColor(message.level)}>
        {message.message}
      </Message>
    );
  }
}

export default connect(Notification.mapper)(Notification);
