import { useEffect, useState } from 'react';
import Blogs from './components/Blogs';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({
        username, password,
      });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
      setUsername('');
      setPassword('');
    } catch (e) {
      setMessage({ className: 'error', content: 'Wrong username or password' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((receivedBlogs) => setBlogs(receivedBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  return (
    <div>
      {user === null && (
      <LoginForm
        handleSubmit={handleLogin}
        password={password}
        setPassword={setPassword}
        setUsername={setUsername}
        username={username}
        message={message}
      />
      )}
      {user !== null && (
        <div>
          <h1>blogs</h1>
          <Notification message={message} />
          <p>
            {`${user.name} logged in`}
          </p>
          <button type="button" onClick={handleLogout}>logout</button>
          <BlogForm setMessage={setMessage} blogs={blogs} setBlogs={setBlogs} />
          <Blogs
            blogs={blogs}
            user={user}
            handleLogout={handleLogout}
          />
        </div>

      )}
    </div>
  );
}

export default App;
