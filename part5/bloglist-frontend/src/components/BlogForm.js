import { useState } from 'react';
import PropTypes from 'prop-types';

function BlogForm({ createBlog }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
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
        <button type="submit"> submit</button>
      </form>
    </div>
  );
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
