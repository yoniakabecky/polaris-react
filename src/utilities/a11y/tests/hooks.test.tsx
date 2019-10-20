import React from 'react';
// import {mountWithApp} from 'test-utilities';
import {mount} from '@shopify/react-testing';
import {useHiddenNotBlank} from '../hooks';

const error = new Error(
  "'label' prop must not be empty string! If you want to hide it, use the 'labelHidden' prop.",
);

describe('useHiddenNotBlank', () => {
  it('logs no error if the prop value is present', () => {
    const handleError = jest.fn();

    mount(
      <TestComponent label="customLabel" value="blah" onError={handleError} />,
    );

    expect(handleError).not.toHaveBeenCalled();
  });

  it('logs an error if the prop value is empty on first render', () => {
    const handleError = jest.fn();

    mount(<TestComponent label="" value="blah" onError={handleError} />);

    expect(handleError).toHaveBeenCalledWith(error);
  });

  it('logs an error if the prop value becomes empty', () => {
    const handleError = jest.fn();

    const root = mount(
      <TestComponent label="customLabel" value="blah" onError={handleError} />,
    );

    root.setProps({label: ''});

    expect(handleError).toHaveBeenCalledWith(error);
  });

  it('only logs the error once', () => {
    const handleError = jest.fn();

    const root = mount(
      <TestComponent label="" value="foo" onError={handleError} />,
    );

    root.setProps({value: 'bar'});

    expect(handleError).toHaveBeenCalledTimes(1);
  });
});

interface TestComponentProps {
  label: string;
  value: any;
  onError(error: Error): void;
}

function TestComponent({label, value, onError}: TestComponentProps) {
  useHiddenNotBlank({propName: 'label', value: label, onError});

  return (
    <div>
      {label}:{value}
    </div>
  );
}
