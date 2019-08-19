import React, {memo, useState, useRef, useEffect} from 'react';
import {closest} from '@shopify/javascript-utilities/dom';
import {
  focusFirstFocusableNode,
  findFirstFocusableNode,
  focusLastFocusableNode,
} from '@shopify/javascript-utilities/focus';

import EventListener from '../EventListener';
import Focus from '../Focus';

export interface Props {
  trapping?: boolean;
  children?: React.ReactNode;
}

function TrapFocus({children, trapping = true}: Props) {
  const [shouldFocusSelf, setShouldFocusSelf] = useState<boolean | undefined>(
    undefined,
  );

  const focusTrapWrapper = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      setShouldFocusSelf(
        focusTrapWrapper.current &&
        focusTrapWrapper.current.contains(document.activeElement)
          ? false
          : trapping,
      );
    },
    [trapping],
  );

  const shouldDisable =
    shouldFocusSelf === undefined
      ? true
      : shouldFocusSelf
        ? !trapping
        : !shouldFocusSelf;
  return (
    <Focus disabled={shouldDisable} root={focusTrapWrapper.current}>
      <div ref={focusTrapWrapper}>
        <EventListener event="focusout" handler={handleBlur} />
        {children}
      </div>
    </Focus>
  );

  function handleBlur(event: FocusEvent) {
    const {relatedTarget} = event;

    if (relatedTarget == null || trapping === false) {
      return;
    }

    if (
      focusTrapWrapper.current &&
      !focusTrapWrapper.current.contains(relatedTarget as HTMLElement) &&
      !closest(relatedTarget as HTMLElement, '[data-polaris-overlay]')
    ) {
      event.preventDefault();

      if (
        event.srcElement === findFirstFocusableNode(focusTrapWrapper.current)
      ) {
        return focusLastFocusableNode(focusTrapWrapper.current);
      }
      focusFirstFocusableNode(focusTrapWrapper.current);
    }
  }
}

export default memo(TrapFocus);
