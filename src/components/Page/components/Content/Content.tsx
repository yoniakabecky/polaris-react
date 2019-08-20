import React from 'react';

import styles from './Content.scss';

export interface Props {
  children?: React.ReactNode;
}

function Content({children}: Props) {
  return <div className={styles.Content}>{children}</div>;
}

export default Content;
