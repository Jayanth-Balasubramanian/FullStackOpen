import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('test Blog component', () => {
  const mockRemoveBlog = jest.fn();
  const mockUpdateBlog = jest.fn();
  const mockBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: {
      username: 'Test',
      name: 'Test',
      id: '',
    },
    id: '62cc03b1cc0ce5abf308114f',
  };
  const mockUser = {
    username: 'Test',
    name: 'Test',
    token: '',
  };
  test('title and author only rendered by default', () => {
    const { container } = render(<Blog
      blog={mockBlog}
      removeBlog={mockRemoveBlog}
      updateBlog={mockUpdateBlog}
      user={mockUser}
    />);
    expect(container).toHaveTextContent(mockBlog.title);
    expect(container).toHaveTextContent(mockBlog.author);
    expect(container).not.toHaveTextContent(mockBlog.url);
    expect(container).not.toHaveTextContent(mockBlog.likes);
  });

  test('clicking view shows blog\'s url and likes', async () => {
    const { container } = render(<Blog
      blog={mockBlog}
      removeBlog={mockRemoveBlog}
      updateBlog={mockUpdateBlog}
      user={mockUser}
    />);
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);
    expect(container).toHaveTextContent(mockBlog.url);
    expect(container).toHaveTextContent(mockBlog.likes);
  });

  test('clicking like button calls event handler', async () => {
    render(<Blog
      blog={mockBlog}
      removeBlog={mockRemoveBlog}
      updateBlog={mockUpdateBlog}
      user={mockUser}
    />);
    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockUpdateBlog).toBeCalledTimes(2);
  });
});
