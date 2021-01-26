import React, {useEffect, useRef} from 'react';

import {Button} from '../../../Button';
import type {ButtonProps} from '../../../Button';
import {useFeatures} from '../../../../utilities/features';
import {classNames} from '../../../../utilities/css';
import {useSetActionRefs} from '../../../../utilities/action-refs-tracker';

import styles from './SecondaryAction.scss';

interface SecondaryAction extends ButtonProps {
  onAction?(): void;
  getOffsetWidth?(width: number): void;
}

export function SecondaryAction({
  children,
  onAction,
  getOffsetWidth,
  id,
  ...rest
}: SecondaryAction) {
  const {newDesignLanguage} = useFeatures();
  const secondaryActionsRef = useRef<HTMLSpanElement>(null);
  const activatorRef = useRef(null);

  useSetActionRefs({
    id,
    actionRef: activatorRef,
  });

  useEffect(() => {
    if (!getOffsetWidth || !secondaryActionsRef.current || !newDesignLanguage)
      return;

    getOffsetWidth(secondaryActionsRef.current?.offsetWidth);
  }, [getOffsetWidth, newDesignLanguage]);

  return (
    <span
      className={classNames(styles.SecondaryAction, styles.newDesignLanguage)}
      ref={secondaryActionsRef}
    >
      <span ref={activatorRef}>
        <Button onClick={onAction} {...rest}>
          {children}
        </Button>
      </span>
    </span>
  );
}
