import React, {useEffect, useRef} from 'react';
import {CircleCancelMinor, SearchMinor} from '@shopify/polaris-icons';
import {classNames} from '../../../../utilities/css';

import Icon from '../../../Icon';
import VisuallyHidden from '../../../VisuallyHidden';
import {createUseIdFactory} from '../../../../utilities/create-use-id-factory';
import {useI18n} from '../../../../utilities/i18n';

import styles from './SearchField.scss';

const useUniqueId = createUseIdFactory('SearchField');

export interface Props {
  /** Initial value for the input */
  value: string;
  /** Hint text to display */
  placeholder?: string;
  /** Force the focus state on the input */
  focused?: boolean;
  /** Force a state where search is active but the text field component is not focused */
  active?: boolean;
  /** Callback when value is changed */
  onChange(value: string): void;
  /** Callback when input is focused */
  onFocus?(): void;
  /** Callback when focus is removed */
  onBlur?(): void;
  /** Callback when search field cancel button is clicked */
  onCancel?(): void;
}

export function SearchField({
  focused,
  value,
  active,
  placeholder,
  onCancel = noop,
  onChange,
  onFocus,
  onBlur,
}: Props) {
  const {translate} = useI18n();
  const input = useRef<HTMLInputElement>(null);
  const searchId = useUniqueId();

  useEffect(() => {
    if (!input.current) return;

    if (focused) {
      input.current.focus();
    }

    if (!focused) {
      input.current.blur();
    }
  });

  const clearMarkup = value !== '' && (
    <button
      type="button"
      aria-label={translate('Polaris.TopBar.SearchField.clearButtonLabel')}
      className={styles.Clear}
      onClick={handleClear}
    >
      <Icon source={CircleCancelMinor} />
    </button>
  );

  const className = classNames(
    styles.SearchField,
    (focused || active) && styles.focused,
  );

  return (
    <div className={className} onFocus={handleFocus} onBlur={handleBlur}>
      <VisuallyHidden>
        <label htmlFor={searchId}>
          {translate('Polaris.TopBar.SearchField.search')}
        </label>
      </VisuallyHidden>
      <input
        id={searchId}
        className={styles.Input}
        placeholder={placeholder}
        type="search"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        ref={input}
        value={value}
        onChange={handleChange}
        onKeyDown={preventDefault}
      />
      <span className={styles.Icon}>
        <Icon source={SearchMinor} />
      </span>

      {clearMarkup}
      <div className={styles.Backdrop} />
    </div>
  );

  function handleFocus() {
    onFocus && onFocus();
  }

  function handleBlur() {
    onBlur && onBlur();
  }

  function handleClear() {
    onCancel();

    if (input.current != null) {
      input.current.value = '';
      onChange('');
      input.current.focus();
    }
  }

  function handleChange({currentTarget}: React.ChangeEvent<HTMLInputElement>) {
    onChange(currentTarget.value);
  }
}

function noop() {}

function preventDefault(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}
export default SearchField;
