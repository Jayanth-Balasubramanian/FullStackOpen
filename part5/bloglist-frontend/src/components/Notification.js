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

export default Notification;
