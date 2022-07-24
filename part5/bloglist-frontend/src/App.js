import { useEffect, useRef, useState } from 'react';
import Blogs from './components/Blogs';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

function App() {
  const blogFormRef = useRef();
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const compareBlogs = (x, y) => {
    if (x.likes > y.likes) {
      return -1;
    } if (x.likes === y.likes) {
      return 0;
    }
    return 1;
  };
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const response = await blogService.create(blogObject);
      setMessage({ className: 'success', content: `a new blog ${blogObject.title} by ${blogObject.author} added` });
      const newBlogs = blogs.concat(response.data);
      setBlogs(newBlogs);
    } catch (e) {
      setMessage({ className: 'error', content: e.response.data.error });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const deleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      try {
        await blogService.deleteBlog(blogObject.id);
        const newBlogs = blogs.filter((blog) => blog !== blogObject);
        setBlogs(newBlogs);
      } catch (e) {
        setMessage({ className: 'error', content: e.response.data.error });
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };
  const updateBlog = async (blogObject) => {
    try {
      const response = await blogService.update(blogObject.id, blogObject);
      const newBlogs = [...blogs];
      const indexToChange = newBlogs.findIndex((blog) => blog.id === blogObject.id);
      newBlogs[indexToChange] = response;
      newBlogs.sort(compareBlogs);
      setBlogs(newBlogs);
    } catch (e) {
      setMessage({ className: 'error', content: e.response.data.error });
      setTimeout(() => setMessage(null), 5000);
    }
  };

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
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser));
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
    blogService.getAll()
      .then((receivedBlogs) => setBlogs(receivedBlogs.sort(compareBlogs)));
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
          <div>
            <p>
              {' '}
              {`${user.name} logged in`}
              <button type="button" onClick={handleLogout}>logout</button>
              <br />
            </p>
          </div>
          <Togglable ref={blogFormRef} buttonLabel="create new blog">
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <Blogs
            blogs={blogs}
            user={user}
            handleLogout={handleLogout}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        </div>

      )}
    </div>
  );
}

export default App;
