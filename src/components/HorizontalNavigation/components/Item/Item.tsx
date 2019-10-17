import React, {useRef, useContext, ReactNode} from 'react';
import {Icon} from '../../../Icon';
import {UnstyledLink} from '../../../UnstyledLink';
import {classNames} from '../../../../utilities/css';
import {IconSource} from '../../../../../types';
import {HorizontalNavigationContext} from '../../context';

import styles from './Item.scss';

export interface ItemProps {
  icon?: IconSource;
  url: string;
  external?: boolean;
  selected?: boolean;
  children?: ReactNode;
  /** Default to children if typeof === string */
  content?: string;
  id: string;
}

export function Item({icon, url, external, selected, children, id}: ItemProps) {
  const item = useRef<HTMLLIElement>(null);
  const {fitted} = useContext(HorizontalNavigationContext);
  const linkClassNames = classNames(styles.link, selected && styles.selected);
  const itemClassNames = classNames(styles.Item, fitted && styles.fitted);

  const iconMarkup = icon && (
    <div className={styles.Icon}>
      <Icon source={icon} />
    </div>
  );

  return (
    <li className={itemClassNames} ref={item} id={`${id}l`}>
      <UnstyledLink
        url={url}
        external={external}
        className={linkClassNames}
        id={id}
      >
        {iconMarkup}
        <div className={styles.title}>{children}</div>
      </UnstyledLink>
    </li>
  );
}
