import * as React from 'react';
import {
  shallowWithAppProvider,
  mountWithAppProvider,
  trigger,
} from 'test-utilities';
import {Icon, Spinner} from 'components';
import ToggleButton, {IconWrapper} from '../ToggleButton';

describe('<ToggleButton />', () => {
  describe('children', () => {
    it('renders the given children into the toggle', () => {
      const label = 'Click me!';
      const toggle = shallowWithAppProvider(
        <ToggleButton>{label}</ToggleButton>,
      );
      expect(toggle.text()).toContain(label);
    });
  });

  describe('id', () => {
    it('is passed into the toggle', () => {
      const id = 'MyID';
      const toggle = shallowWithAppProvider(<ToggleButton id={id} />);
      expect(toggle.find('button').prop('id')).toBe(id);
    });
  });

  describe('disabled', () => {
    it('disable renders <button disabled>', () => {
      const toggle = shallowWithAppProvider(<ToggleButton disabled />);
      expect(toggle.find('button').prop('disabled')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('loading renders <button disabled>', () => {
      const toggle = shallowWithAppProvider(<ToggleButton loading />);
      expect(toggle.find('button').prop('disabled')).toBe(true);
    });

    it('renders a spinner into the toggle', () => {
      const toggle = shallowWithAppProvider(<ToggleButton loading />);
      expect(toggle.find(Spinner).exists()).toBeTruthy();
    });

    it('sets an alert role on the button', () => {
      const toggle = shallowWithAppProvider(<ToggleButton loading />);
      expect(toggle.find('button').prop('role')).toBe('alert');
    });

    it('sets aria-busy on the button', () => {
      const toggle = shallowWithAppProvider(<ToggleButton loading />);
      expect(toggle.find('button').prop('aria-busy')).toBeTruthy();
    });
  });

  describe('icon', () => {
    it('renders an icon if it’s a string', () => {
      // TODO: Update this with an icon that makes sense
      const source = 'delete';
      const toggle = shallowWithAppProvider(<ToggleButton icon={source} />);
      expect(toggle.find(Icon).prop('source')).toBe(source);
    });

    it('renders an icon if it’s an SVGSource object', () => {
      const source = {body: '<SVG />', viewBox: ''};
      const toggle = shallowWithAppProvider(<ToggleButton icon={source} />);
      expect(toggle.find(Icon).prop('source')).toBe(source);
    });

    it('renders a react node if it is one', () => {
      const Icon = () => <div>Hi there!</div>;
      const toggle = shallowWithAppProvider(<ToggleButton icon={<Icon />} />);
      expect(toggle.find(Icon).exists()).toBeTruthy();
    });

    it('does not render the markup for the icon if none is provided', () => {
      const toggle = mountWithAppProvider(<ToggleButton />);
      expect(toggle.find(IconWrapper).exists()).toBe(false);
    });
  });

  describe('accessibilityLabel', () => {
    it('sets an aria-label on the toggle', () => {
      const label = 'This toggles something';
      const toggle = shallowWithAppProvider(
        <ToggleButton accessibilityLabel={label} />,
      );
      expect(toggle.find('button').prop('aria-label')).toBe(label);
    });
  });

  describe('ariaControls', () => {
    it('sets an aria-controls on the toggle', () => {
      const id = 'panel1';
      const toggle = shallowWithAppProvider(<ToggleButton ariaControls={id} />);
      expect(toggle.find('button').prop('aria-controls')).toBe(id);
    });
  });

  describe('pressed', () => {
    it('sets an aria-pressed on the button', () => {
      const button = shallowWithAppProvider(<ToggleButton pressed />);
      expect(button.find('button').prop('aria-pressed')).toBeTruthy();
    });
  });

  describe('onClick()', () => {
    it('is called when the toggle is clicked', () => {
      const onClickSpy = jest.fn();
      const toggle = shallowWithAppProvider(
        <ToggleButton onClick={onClickSpy} />,
      );
      trigger(toggle.find('button'), 'onClick');
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onFocus()', () => {
    it('is called when the toggle is focussed', () => {
      const onFocusSpy = jest.fn();
      const toggle = shallowWithAppProvider(
        <ToggleButton onFocus={onFocusSpy} />,
      );
      trigger(toggle.find('button'), 'onFocus');
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onBlur()', () => {
    it('is called when the toggle is blurred', () => {
      const onBlurSpy = jest.fn();
      const toggle = shallowWithAppProvider(
        <ToggleButton onBlur={onBlurSpy} />,
      );
      trigger(toggle.find('button'), 'onBlur');
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onKeyPress()', () => {
    it('is called when a keypress event is registered on the toggle', () => {
      const fakeEventData = {key: 'foo'};
      const spy = jest.fn();
      shallowWithAppProvider(
        <ToggleButton onKeyPress={spy}>Test</ToggleButton>,
      ).simulate('keypress', fakeEventData);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(fakeEventData);
    });
  });

  describe('onKeyUp()', () => {
    it('is called when a keyup event is registered on the toggle', () => {
      const fakeEventData = {key: 'foo'};
      const spy = jest.fn();
      shallowWithAppProvider(
        <ToggleButton onKeyUp={spy}>Test</ToggleButton>,
      ).simulate('keyup', fakeEventData);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(fakeEventData);
    });
  });

  describe('onKeyDown()', () => {
    it('is called when a keydown event is registered on the toggle', () => {
      const fakeEventData = {key: 'foo'};
      const spy = jest.fn();
      shallowWithAppProvider(
        <ToggleButton onKeyDown={spy}>Test</ToggleButton>,
      ).simulate('keydown', fakeEventData);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(fakeEventData);
    });
  });
});
