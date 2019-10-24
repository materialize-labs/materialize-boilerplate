import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from './ResetPassword';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><ResetPassword /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
