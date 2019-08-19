import React, {useState, memo} from 'react';

import {classNames} from '../../../../utilities/css';
import {Props as ButtonProps} from '../../../Button';

import styles from '../../ButtonGroup.scss';

export interface Props {
  button: React.ReactElement<ButtonProps>;
}

function Item({button}: Props) {
  const [focused, setFocused] = useState(false);

  const className = classNames(
    styles.Item,
    focused && styles['Item-focused'],
    button.props.plain && styles['Item-plain'],
  );

  return (
    <div className={className} onFocus={handleFocus} onBlur={handleBlur}>
      {button}
    </div>
  );

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur() {
    setFocused(false);
  }
}

export default memo(Item);
