import React from 'react';
import PropTypes from 'prop-types';

export class Component extends React.Component {
  render() {
    return <div className="Component">Component works!</div>;
  }
}

Component.propTypes = {
  className: PropTypes.string,
};
