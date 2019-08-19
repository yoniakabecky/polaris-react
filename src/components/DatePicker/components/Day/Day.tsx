import React, {memo, useRef, useEffect} from 'react';
import {Months, isSameDay} from '@shopify/javascript-utilities/dates';
import {classNames} from '../../../../utilities/css';
import {useI18n} from '../../../../utilities/i18n';

import styles from '../../DatePicker.scss';

export interface Props {
  focused?: boolean;
  day?: Date;
  selected?: boolean;
  inRange?: boolean;
  inHoveringRange?: boolean;
  disabled?: boolean;
  onClick?(day: Date): void;
  onHover?(day: Date): void;
  onFocus?(day: Date): void;
}

function Day({
  focused,
  day,
  onClick,
  onHover = noop,
  onFocus = noop,
  selected,
  inRange,
  inHoveringRange,
  disabled,
}: Props) {
  const {translate} = useI18n();
  const dayNode = useRef<HTMLButtonElement>(null);

  useEffect(
    () => {
      focused && dayNode.current && dayNode.current.focus();
    },
    [focused],
  );

  const handleHover = onHover.bind(null, day);
  if (!day) {
    return <div className={styles.EmptyDay} onMouseOver={handleHover} />;
  }
  const handleClick = onClick && !disabled ? onClick.bind(null, day) : noop;
  const today = isSameDay(new Date(), day);
  const className = classNames(
    styles.Day,
    selected && styles['Day-selected'],
    disabled && styles['Day-disabled'],
    today && styles['Day-today'],
    (inRange || inHoveringRange) && !disabled && styles['Day-inRange'],
  );
  const date = day.getDate();
  const tabIndex =
    (focused || selected || today || date === 1) && !disabled ? 0 : -1;
  const ariaLabel = [
    `${today ? translate('Polaris.DatePicker.today') : ''}`,
    `${Months[day.getMonth()]} `,
    `${date} `,
    `${day.getFullYear()}`,
  ].join('');

  return (
    <button
      onFocus={onFocus.bind(null, day)}
      type="button"
      ref={dayNode}
      tabIndex={tabIndex}
      className={className}
      onMouseOver={handleHover}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-selected={selected}
      aria-disabled={disabled}
      role="gridcell"
    >
      {date}
    </button>
  );
}

export default memo(Day);

function noop() {}
