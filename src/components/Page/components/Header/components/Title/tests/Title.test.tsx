import * as React from 'react';
import {mountWithAppProvider} from 'test-utilities/legacy';
import {Badge, DisplayText, Avatar} from 'components';
import Title from '..';

describe('<Title />', () => {
  const children = 'Test';
  describe('children', () => {
    it('renders a DisplayText with the children', () => {
      const pageTitle = mountWithAppProvider(<Title>{children}</Title>);
      expect(pageTitle.find(DisplayText).text()).toBe(children);
    });
  });

  describe('subtitle', () => {
    const propsWithSubtitle = {
      subtitle: 'Subtitle',
    };

    it('renders a paragaph when defined', () => {
      const pageTitle = mountWithAppProvider(
        <Title {...propsWithSubtitle}>{children}</Title>,
      );
      expect(pageTitle.find('p').text()).toBe(propsWithSubtitle.subtitle);
    });

    it('does not render a paragraph when not defined', () => {
      const pageTitle = mountWithAppProvider(<Title>{children}</Title>);
      expect(pageTitle.find('p').exists()).toBe(false);
    });
  });

  describe('titleMetadata', () => {
    const propsWithMetadata = {
      titleMetadata: <Badge>Sold</Badge>,
    };

    it('renders the titleMetadata when defined', () => {
      const pageTitle = mountWithAppProvider(
        <Title {...propsWithMetadata}>{children}</Title>,
      );
      expect(pageTitle.find(Badge).exists()).toBe(true);
    });
  });

  describe('thumbail', () => {
    const propsWithThumbail = {
      thumbnail: <Avatar customer />,
    };

    it('renders the thumbnail when defined', () => {
      const pageTitle = mountWithAppProvider(
        <Title {...propsWithThumbail}>{children}</Title>,
      );
      expect(pageTitle.find(Avatar).exists()).toBe(true);
    });
  });
});
