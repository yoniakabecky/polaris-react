import React from 'react';

import styles from '../../Button.scss';

export function IconWrapper({children}: any) {
  const wrappedChildMarkup = children ? (
    <span className={styles.Icon}>{children}</span>
  ) : null;

  return wrappedChildMarkup;
}
