import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import Contact from './Contact';


it('renders without crashing', () => {
  const wrapper = mount(
    <MemoryRouter>
      <Contact
        match={{
          params: { id: '1' },
          isExact: true,
          path: '/contacts/:id',
          name: 'Contact details',
        }}
      />
    </MemoryRouter>,
  );
  expect(wrapper.containsMatchingElement(<strong>Samppa Nori</strong>))
    .toEqual(true);
  wrapper.unmount();
});
