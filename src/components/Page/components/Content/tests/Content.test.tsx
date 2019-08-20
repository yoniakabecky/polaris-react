import React from 'react';
import {mountWithAppProvider} from 'test-utilities/legacy';
import Content from '../Content';

describe('<Content />', () => {
  it('renders its children', () => {
    const child = <p>Some text</p>;
    const wrapper = mountWithAppProvider(<Content>{child}</Content>);

    expect(wrapper.find(child)).toHaveLength(1);
  });
});
