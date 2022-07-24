import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('Blog form component tests', () => {
  const createBlog = jest.fn();
  test('form calls event handler when new blog is created', async () => {
    render(<BlogForm createBlog={createBlog} />);
    const user = userEvent.setup();
    const submitButton = screen.getByText('submit');
    await user.click(submitButton);
    expect(createBlog).toBeCalled();
  });
});
