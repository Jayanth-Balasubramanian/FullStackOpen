import React from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

function LoginForm({
  handleSubmit, username, setUsername, password, setPassword, message,
}) {
  return (
    <div id="login">
      <h2>log in to application</h2>
      <Notification message={message} />
      <form>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <div>
          <button id="login-button" type="submit" onClick={handleSubmit}>login</button>
        </div>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  message: PropTypes.string,
};

LoginForm.defaultProps = {
  message: null,
};
export default LoginForm;
