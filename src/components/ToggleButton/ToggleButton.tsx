import * as React from 'react';
import {classNames} from '@shopify/react-utilities';

import {withAppProvider, WithAppProviderProps} from '../AppProvider';
import {handleMouseUpByBlurring} from '../../utilities/focus';
import Icon, {Props as IconProps} from '../Icon';
import styles from './ToggleButton.scss';

export type IconSource = IconProps['source'];

export interface Props {
  /** The content to display inside the toggle */
  children?: string | string[];
  /** A unique identifier for the toggle */
  id?: string;
  /** Provides extra visual weight and identifies the toggle as the primary action on the page */
  primary?: boolean;
  /** Disables the toggle, disallowing merchant interaction */
  disabled?: boolean;
  /** Replaces toggle text with a spinner while a background action is being performed */
  loading?: boolean;
  /** Gives the toggle a subtle alternative to the default styling, appropriate for certain backdrops */
  outline?: boolean;
  /** Icon to display to the left of the toggle content */
  icon?: React.ReactNode | IconSource;
  /** Visually hidden text for screen readers */
  accessibilityLabel?: string;
  /** Id of the element the toggle controls */
  ariaControls?: string;
  /** Tells screen reader the toggle is pressed, and sets the aria-pressed property */
  pressed?: boolean;
  /** Callback when clicked */
  onClick?(): void;
  /** Callback when toggle becomes focused */
  onFocus?(): void;
  /** Callback when focus leaves toggle */
  onBlur?(): void;
  /** Callback when a keypress event is registered on the toggle */
  onKeyPress?(event: React.KeyboardEvent<HTMLButtonElement>): void;
  /** Callback when a keyup event is registered on the toggle */
  onKeyUp?(event: React.KeyboardEvent<HTMLButtonElement>): void;
  /** Callback when a keydown event is registered on the toggle */
  onKeyDown?(event: React.KeyboardEvent<HTMLButtonElement>): void;
}

export type CombinedProps = Props & WithAppProviderProps;

function ToggleButton({
  id,
  disabled,
  loading,
  children,
  accessibilityLabel,
  ariaControls,
  pressed,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  icon,
  primary,
  outline,
}: CombinedProps) {
  const className = classNames(
    styles.ToggleButton,
    primary && styles.primary,
    outline && styles.outline,
    disabled && styles.disabled,
    pressed && styles.pressed,
    icon && children == null && styles.iconOnly,
  );

  let iconMarkup;

  if (icon) {
    const iconInner = isIconSource(icon) ? (
      <Icon source={loading ? 'placeholder' : icon} />
    ) : (
      icon
    );
    iconMarkup = <IconWrapper>{iconInner}</IconWrapper>;
  }

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onKeyPress={onKeyPress}
      onMouseUp={handleMouseUpByBlurring}
      className={className}
      disabled={disabled}
      aria-label={accessibilityLabel}
      aria-controls={ariaControls}
      aria-pressed={pressed}
      role={loading ? 'alert' : undefined}
      aria-busy={loading ? true : undefined}
    >
      <span className={styles.Content}>
        {children && <span className={styles.Text}>{children}</span>}
        {iconMarkup && iconMarkup}
      </span>
    </button>
  );
}

export function IconWrapper({children}: any) {
  return <span className={styles.Icon}>{children}</span>;
}

function isIconSource(x: any): x is IconSource {
  return typeof x === 'string' || (typeof x === 'object' && x.body);
}

export default withAppProvider<Props>()(ToggleButton);
