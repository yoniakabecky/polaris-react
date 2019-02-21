import * as React from 'react';
import Button from '../Button';

import {handleMouseUpByBlurring} from '../../utilities/focus';
import styles from './ToggleButton.scss';

export interface Props {
  /** The content to display inside the toggle */
  content: string | string[];
  /** A unique identifier for the toggle */
  id?: string;
  /** Provides extra visual weight and identifies the toggle as the primary action */
  primary?: boolean;
  /** Disables the toggle, disallowing merchant interaction */
  disabled?: boolean;
  /** Gives the toggle a subtle alternative to the default styling, appropriate for certain backdrops */
  outline?: boolean;
  /** Visually hidden text for screen readers */
  accessibilityLabel?: string;
  /** Id of the element the toggle controls */
  ariaControls?: string;
  /** Tells screen reader the toggle is pressed */
  pressed: boolean;
  /** Callback when clicked */
  onClick?(): void;
  /** Callback when toggle becomes focussed */
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

export default function ToggleButton({
  id,
  disabled,
  content,
  accessibilityLabel,
  ariaControls,
  pressed,
  primary,
  outline,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyPress,
  onKeyUp,
}: Props) {
  return (
    <Button
      id={id}
      primary={primary}
      outline={outline}
      className={styles.ToggleButton}
      disabled={disabled}
      aria-label={accessibilityLabel}
      aria-controls={ariaControls}
      aria-pressed={pressed}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onKeyPress={onKeyPress}
      onMouseUp={handleMouseUpByBlurring}
    >
      {content}
    </Button>
  );
}
