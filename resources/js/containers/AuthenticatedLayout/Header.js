import React from 'react';
import {
  NavLink,
} from 'react-router-dom';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
} from 'reactstrap';
import PropTypes from 'prop-types';

import {
  AppHeaderDropdown,
  AppNavbarBrand,
} from '@coreui/react';
import logo from '../../assets/img/brand/materialize-logo.svg';

const propTypes = {
  children: PropTypes.node,
  session: PropTypes.shape({
    me: PropTypes.shape({
      avatar: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
};

const defaultProps = {
  children: React.createElement('div'),
  session: {},
};

const Header = (props) => {
  // eslint-disable-next-line
  const { children, onLogout, session, ...attributes } = props;
  const { avatar, email } = session.me;
  const userAvatar = avatar || '/images/default-avatar.jpg';
  return (
    <React.Fragment>
      <AppNavbarBrand
        full={{
          src: logo,
          width: 160,
          alt: 'Materialize Labs Logo',
        }}
      />

      <Nav className="ml-auto" navbar>
        <NavItem className="d-md-down-none">
          <NavLink to="#" className="nav-link">
            <i className="icon-bell" />
            {/* <Badge pill color="danger">5</Badge> */}
          </NavLink>
        </NavItem>
        <AppHeaderDropdown direction="down">
          <DropdownToggle nav>
            <img src={userAvatar} className="img-avatar" alt={email} />
          </DropdownToggle>
          <DropdownMenu right style={{ right: 'auto' }}>
            <DropdownItem header tag="div" className="text-center">
              <strong>{email}</strong>
            </DropdownItem>
            <DropdownItem>
              <i className="fa fa-envelope-o" />
              {' '}
              Messages
              {/* <Badge color="success">42</Badge> */}
            </DropdownItem>
            <DropdownItem>
              <i className="fa fa-user" />
              {' '}
              Profile
            </DropdownItem>
            <DropdownItem>
              <i className="fa fa-wrench" />
              {' '}
              Settings
            </DropdownItem>
            <DropdownItem onClick={e => onLogout(e)}>
              <i className="fa fa-lock" />
              {' '}
              Logout
            </DropdownItem>
          </DropdownMenu>
        </AppHeaderDropdown>
      </Nav>
      {/* <AppAsideToggler className="d-md-down-none" /> */}
      {/* <AppAsideToggler className="d-lg-none" mobile /> */}
    </React.Fragment>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
