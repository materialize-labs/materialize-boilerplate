import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = { children: React.createElement('div') };

const Footer = (props) => {
  // eslint-disable-next-line
  const { children, ...attributes } = props;

  return (
    <React.Fragment>
      <span>
        &copy; &nbsp;
        {new Date().getFullYear()}
        &nbsp;
        Materialize
      </span>
    </React.Fragment>
  );
};

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
