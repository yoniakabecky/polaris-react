import React, {memo, useRef, useCallback} from 'react';
import {MinusMinor, TickSmallMinor} from '@shopify/polaris-icons';

import {classNames} from '../../utilities/css';
import {createUseIdFactory} from '../../utilities/create-use-id-factory';
import Choice, {helpTextID} from '../Choice';
import {errorTextID} from '../InlineError';
import Icon from '../Icon';
import {Error, Key} from '../../types';

import styles from './Checkbox.scss';

export interface BaseProps {
  /** Indicates the ID of the element that describes the checkbox*/
  ariaDescribedBy?: string;
  /** Label for the checkbox */
  label: React.ReactNode;
  /** Visually hide the label */
  labelHidden?: boolean;
  /** Checkbox is selected. `indeterminate` shows a horizontal line in the checkbox */
  checked?: boolean | 'indeterminate';
  /** Additional text to aide in use */
  helpText?: React.ReactNode;
  /** Disable input */
  disabled?: boolean;
  /** ID for form input */
  id?: string;
  /** Name for form input */
  name?: string;
  /** Value for form input */
  value?: string;
  /** Display an error message */
  error?: Error | boolean;
  /** Callback when checkbox is toggled */
  onChange?(newChecked: boolean, id: string): void;
  /** Callback when checkbox is focussed */
  onFocus?(): void;
  /** Callback when focus is removed */
  onBlur?(): void;
}

export interface Props extends BaseProps {}

const useUniqueID = createUseIdFactory('Checkbox');

function Checkbox({
  onChange,
  ariaDescribedBy: ariaDescribedByProp,
  id,
  label,
  labelHidden,
  helpText,
  checked = false,
  error,
  disabled,
  onFocus,
  onBlur,
  name,
  value,
}: Props) {
  const checkboxId = useUniqueID(id);
  const inputNode = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(
    () => {
      if (onChange == null || inputNode.current == null || disabled) {
        return;
      }

      onChange(!inputNode.current.checked, checkboxId);
      inputNode.current.focus();
    },
    [disabled, checkboxId, onChange],
  );

  const describedBy: string[] = [];
  if (error && typeof error !== 'boolean') {
    describedBy.push(errorTextID(checkboxId));
  }
  if (helpText) {
    describedBy.push(helpTextID(checkboxId));
  }
  if (ariaDescribedByProp) {
    describedBy.push(ariaDescribedByProp);
  }
  const ariaDescribedBy = describedBy.length
    ? describedBy.join(' ')
    : undefined;

  const wrapperClassName = classNames(styles.Checkbox, error && styles.error);

  const isIndeterminate = checked === 'indeterminate';
  const isChecked = !isIndeterminate && Boolean(checked);

  const indeterminateAttributes = isIndeterminate
    ? {indeterminate: 'true', 'aria-checked': 'mixed' as 'mixed'}
    : {'aria-checked': isChecked};

  const iconSource = isIndeterminate ? MinusMinor : TickSmallMinor;

  const inputClassName = classNames(
    styles.Input,
    isIndeterminate && styles['Input-indeterminate'],
  );

  return (
    /* eslint-disable jsx-a11y/no-redundant-roles */
    <Choice
      id={checkboxId}
      label={label}
      labelHidden={labelHidden}
      helpText={helpText}
      error={error}
      disabled={disabled}
      onClick={handleInput}
    >
      <span className={wrapperClassName}>
        <input
          onKeyUp={handleKeyUp}
          ref={inputNode}
          id={checkboxId}
          name={name}
          value={value}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          className={inputClassName}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={stopPropagation}
          onChange={noop}
          aria-invalid={error != null}
          aria-describedby={ariaDescribedBy}
          role="checkbox"
          {...indeterminateAttributes}
        />
        <span className={styles.Backdrop} />
        <span className={styles.Icon}>
          <Icon source={iconSource} />
        </span>
      </span>
    </Choice>
    /* eslint-enable jsx-a11y/no-redundant-roles */
  );

  function handleKeyUp(event: React.KeyboardEvent) {
    const {keyCode} = event;

    if (keyCode !== Key.Space) return;
    handleInput();
  }
}

function noop() {}

function stopPropagation<E>(event: React.MouseEvent<E>) {
  event.stopPropagation();
}

export default memo(Checkbox);
