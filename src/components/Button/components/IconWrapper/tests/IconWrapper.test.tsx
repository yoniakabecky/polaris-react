import React from 'react';
// eslint-disable-next-line no-restricted-imports
import {mountWithAppProvider} from 'test-utilities/legacy';

import {IconWrapper} from '../IconWrapper';

describe('<IconWrapper />', () => {
  it('renders children when provided', () => {
    const iconWrapper = mountWithAppProvider(
      <IconWrapper>
        <div />
      </IconWrapper>,
    );

    expect(iconWrapper.find('div')).toHaveLength(1);
  });

  it('renders nothing if no children are provided', () => {
    const iconWrapper = mountWithAppProvider(<IconWrapper />);

    expect(iconWrapper.find('div')).toHaveLength(0);
  });
});
