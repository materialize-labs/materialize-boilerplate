import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Contacts from './Contacts';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Contacts /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
