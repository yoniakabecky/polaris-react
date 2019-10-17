import React from 'react';
import {ArrowLeftMinor, ArrowRightMinor} from '@shopify/polaris-icons';
import {Icon} from '../../../Icon';
import {variationName, classNames} from '../../../../utilities/css';

import styles from './Pagination.scss';

export enum PaginationDirection {
  Left = 'left',
  Right = 'right',
}

export interface PaginationProps {
  direction: PaginationDirection;
  visible?: boolean;
  onClick(): void;
}

export function Pagination({direction, onClick, visible}: PaginationProps) {
  const iconSource =
    direction === PaginationDirection.Left ? ArrowLeftMinor : ArrowRightMinor;

  const wrapperClassNames = classNames(
    styles.Wrapper,
    !visible && styles.hidden,
    styles[variationName('direction', direction)],
  );

  const paginationClassNames = classNames(
    styles.Pagination,
    styles[variationName('pagination', direction)],
  );

  return (
    <div className={wrapperClassNames}>
      <div className={paginationClassNames} onClick={onClick}>
        <Icon source={iconSource} color="white" />
      </div>
    </div>
  );
}
