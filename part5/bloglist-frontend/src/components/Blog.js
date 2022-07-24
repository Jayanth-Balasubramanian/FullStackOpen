import { useState } from 'react';
import PropTypes from 'prop-types';

function Blog({
  blog, updateBlog, removeBlog, user,
}) {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const addLike = (e) => {
    e.preventDefault();
    const updatedBlog = {
      ...blog, user: blog.user.id, likes: blog.likes + 1,
    };
    updateBlog(updatedBlog);
  };

  const handleDelete = () => {
    removeBlog(blog);
  };
  const [showDetails, setShowDetails] = useState(false);
  const displayDetails = () => {
    setShowDetails(true);
  };
  const hideDetails = () => {
    setShowDetails(false);
  };
  return (
    <div style={blogStyle}>
      {!showDetails && (
        <div>
          <p>
            {`${blog.title} ${blog.author}`}
            <button type="button" onClick={displayDetails}>view</button>
          </p>
        </div>
      )}

      {showDetails && (
        <div>
          <p>
            {`${blog.title} ${blog.author}`}
            <button type="button" onClick={hideDetails}>hide</button>
          </p>
          <p>
            {' '}
            {blog.url}
            {' '}
          </p>
          <p>
            {`likes ${blog.likes}`}
            <button type="button" onClick={addLike}> like</button>
          </p>
          <p>
            {' '}
            {blog.user.name}
            {' '}
          </p>
          {blog.user.username === user.username
            && <button type="button" onClick={handleDelete}>delete</button>}
        </div>
      )}
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string,
      id: PropTypes.string.isRequired,
    }),
    id: PropTypes.string.isRequired,
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
};
export default Blog;
