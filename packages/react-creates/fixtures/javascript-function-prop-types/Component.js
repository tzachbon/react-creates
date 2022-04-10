import PropTypes from 'prop-types';

export const Component = (props) => {
  return <div className="Component">Component works!</div>;
};

Component.propTypes = {
  className: PropTypes.string,
};
