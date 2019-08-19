import React, {useRef, memo} from 'react';
import {classNames} from '../../../../utilities/css';
import styles from './Search.scss';

export interface Props {
  /** Toggles whether or not the search is visible */
  visible?: boolean;
  /** The content to display inside the search */
  children?: React.ReactNode;
  /** Callback when the search is dismissed */
  onDismiss?(): void;
}

function Search({visible, children, onDismiss}: Props) {
  const node = useRef<HTMLDivElement>(null);

  const searchClassName = classNames(styles.Search, visible && styles.visible);

  return (
    <div ref={node} className={searchClassName} onClick={handleDismiss}>
      <div className={styles.Overlay}>{children}</div>
    </div>
  );

  function handleDismiss({target}: React.MouseEvent<HTMLElement>) {
    if (onDismiss != null && target === node.current) {
      onDismiss();
    }
  }
}

export default memo(Search);
