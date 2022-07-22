import PropTypes from 'prop-types';
import Blog from './Blog';

function Blogs({
  updateBlog, blogs, deleteBlog, user,
}) {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );
}

Blogs.propTypes = {
  updateBlog: PropTypes.func.isRequired,
  blogs: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
};

export default Blogs;
