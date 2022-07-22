import PropTypes from 'prop-types';

function Notification({ message }) {
  if (message === null) {
    return null;
  }
  const { content, className } = message;
  return (
    <div className={className}>
      {content}
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
  }),
};

Notification.defaultProps = {
  message: null,
};

export default Notification;
