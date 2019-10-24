import React from 'react';
import { shallow } from 'enzyme/build';
import MainApp from './MainApp';


it('mounts without crashing', () => {
  const wrapper = shallow(<MainApp />);
  wrapper.unmount();
});
