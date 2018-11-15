import React from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

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
    return { message: state.notify.data[0] };
  }

  render() {
    const { message } = this.props;
    if (!message) {
      return null;
    }
    return (
      <div style={style.container}>
        <Message style={style.container} color={mapLevelToColor(message.level)}>
          {message.message}
        </Message>
      </div>
    );
  }
}

export default connect(Notification.mapper)(Notification);
