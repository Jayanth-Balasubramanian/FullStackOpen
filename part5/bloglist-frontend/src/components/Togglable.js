import { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);
  const { buttonLabel, children } = props;
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => ({
    toggleVisibility,
  }));

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button type="button" onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
  children: PropTypes.any,
};

export default Togglable;
