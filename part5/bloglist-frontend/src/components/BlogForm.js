import { useState } from 'react';
import blogService from '../services/blogs';

function BlogForm({
  setMessage, setBlogs, blogs,
}) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await blogService.create({
        title, author, url,
      });
      setMessage({ className: 'success', content: `a new blog ${title} by ${author} added` });
      const newBlogs = blogs.concat(response.data);
      setBlogs(newBlogs);
    } catch (e) {
      setMessage({ className: 'error', content: e.response.data.error });
    } finally {
      setTimeout(() => setMessage(null), 5000);
      setTitle('');
      setAuthor('');
      setUrl('');
    }
  }
  return (
    <div id="blogForm">
      <h2>create new</h2>
      <form id="addBlog" onSubmit={handleSubmit}>
        <div>
          title <input id="title" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author <input id="author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url <input id="url" value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit"> submit </button>
      </form>
    </div>
  );
}

export default BlogForm;
