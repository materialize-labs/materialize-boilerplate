import React from 'react';
import ReactDOM from 'react-dom';
import Aside from '../Aside';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Aside />, div);
  ReactDOM.unmountComponentAtNode(div);
});
