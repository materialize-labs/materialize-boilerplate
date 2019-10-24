import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  style: PropTypes.shape(),
};

const defaultProps = {
  style: {},
};

const Loading = props => (
  <div className="position-absolute" style={{ ...props.style, zIndex: 1000 }}>
    <i className="fa fa-spinner fa-spin" />
  </div>
);

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
