import React from 'react';
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
          {' '}
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          {' '}
          <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>

        <div>
          <button type="submit" onClick={handleSubmit}>login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
