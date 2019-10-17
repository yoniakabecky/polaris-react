import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import debounce from 'lodash/debounce';
import {setRootProperty} from '../../utilities/set-root-property';
import {Item, Pagination} from './components';
import {HorizontalNavigationContext} from './context';

import styles from './HorizontalNavigation.scss';

export interface HorizontalNavigationProps {
  /** Location to render nav items */
  children?: React.ReactNode;
  /** Fit nav items to container */
  fitted?: boolean;
  /** Callback when a nav item is selected */
  onSelect?(selectedTabIndex: number): void;
}

const PAGINATION_WIDTH = 103;

export function HorizontalNavigation({
  children,
  fitted,
  onSelect,
}: HorizontalNavigationProps) {
  const nav = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const context = useMemo(() => ({fitted}), [fitted]);
  const [availableLeftSpace, setAvailableLeftSpace] = useState(false);
  const [availableRightSpace, setAvailableRightSpace] = useState(false);

  const handleScroll = useCallback(
    debounce(
      (event?: React.UIEvent) => {
        event && event.persist();
        const {target: eventTarget} = event || {target: null};
        const target =
          eventTarget && eventTarget instanceof HTMLElement
            ? eventTarget
            : nav.current;

        if (!target) return;

        const availableScrollAmount = target.scrollWidth - target.offsetWidth;
        const scrollRight = availableScrollAmount - target.scrollLeft;

        const canScrollLeft = target.scrollLeft > 0;

        if (availableLeftSpace !== canScrollLeft) {
          setAvailableLeftSpace(canScrollLeft);
        }

        const canScrollRight = target.scrollLeft < availableScrollAmount;
        if (availableRightSpace !== canScrollRight) {
          setAvailableRightSpace(canScrollRight);
        }
      },
      10,
      {leading: true, trailing: true, maxWait: 10},
    ),
    [availableLeftSpace, availableRightSpace],
  );

  useEffect(handleScroll, []);

  useEffect(() => {
    if (!list.current) return;

    setRootProperty(
      '--list-height',
      `${list.current!.offsetHeight}px`,
      wrapper.current,
    );

    setRootProperty(
      '--pagination-width',
      `${nav.current!.scrollWidth}px`,
      wrapper.current,
    );

    setRootProperty(
      '--nav-width',
      `${nav.current!.offsetWidth}px`,
      wrapper.current,
    );
  }, []);

  const handleLeftClick = useCallback(() => {
    if (!list.current) return;
    const nextListItem = nextVisibleElement(list.current)!;
    console.log('Scrolling to: ', nextListItem);

    const {x: navLeftOffset} = nav.current!.getBoundingClientRect() as DOMRect;
    console.log('Scrolling too: ', nextListItem);
    nav.current!.scrollBy({
      left: nextListItem.getBoundingClientRect().left - 103 - navLeftOffset,
      behavior: 'smooth',
    });
  }, []);

  const handleRightClick = useCallback(() => {
    if (!list.current) return;
    const nextListItem = nve(list.current)!;
    console.log('Scrolling to: ', nextListItem);

    const {
      x: navLeftOffset,
      right,
    } = nav.current!.getBoundingClientRect() as DOMRect;
    console.log(
      nav.current!.getBoundingClientRect().right -
        103 -
        nextListItem.getBoundingClientRect().right,
    );
    // right edge of item - right edge of nav - pagination button
    nav.current!.scrollBy({
      // distance to nextListItem will be from right edge
      left: Math.abs(
        nav.current!.getBoundingClientRect().right -
          103 -
          nextListItem.getBoundingClientRect().right,
      ),
      behavior: 'smooth',
    });
    function nve(element: HTMLElement) {
      // Ignore pagination button
      const [, ...children] = element.children;
      // Previous child we can return when we've gone to far
      for (const child of children) {
        if (
          Math.round(
            child.getBoundingClientRect().right -
              nav.current!.getBoundingClientRect().x,
          ) >
          nav.current!.getBoundingClientRect().width - 103
        ) {
          return child;
        }
      }

      return null;
    }
  }, []);

  /**
 *         // Getting very inexact measuremts that were a hundreth or thousands off e.g
        // 102.984375 or 102.997332
        Math.round(
          // current list items left position
          child.getBoundingClientRect().left -
            // container distance from edge of screen
            nav.current!.getBoundingClientRect().x,
        ) >=
        // pagiation overlay length
        103
 */

  const paginationleftMarkup = (
    <Pagination
      direction={'left' as const}
      onClick={handleLeftClick}
      visible={availableLeftSpace}
    />
  );

  const paginationRightMarkup = (
    <Pagination
      direction={'right' as const}
      onClick={handleRightClick}
      visible={availableRightSpace}
    />
  );

  return (
    <div className={styles.OuterWrapper} ref={wrapper}>
      <HorizontalNavigationContext.Provider value={context}>
        <nav className={styles.wrapper} ref={nav} onScroll={handleScroll}>
          <ul className={styles.HorizontalNavigation} ref={list}>
            {paginationleftMarkup}
            {children}
            {paginationRightMarkup}
          </ul>
        </nav>
      </HorizontalNavigationContext.Provider>
    </div>
  );

  function nextVisibleElement(element: HTMLElement) {
    // Ignore pagination button
    const [, ...children] = element.children;
    // Previous child we can return when we've gone to far
    let previousChild = null;

    for (const child of children) {
      if (
        // Getting very inexact measuremts that were a hundreth or thousands off e.g
        // 102.984375 or 102.997332
        Math.round(
          // current list items left position
          child.getBoundingClientRect().left -
            // container distance from edge of screen
            nav.current!.getBoundingClientRect().x,
        ) >=
        // pagiation overlay length
        103
      )
        return previousChild;
      // if (child.getBoundingClientRect().left > 103) return previousChild;
      previousChild = child;
    }

    return null;
  }
}

HorizontalNavigation.Item = Item;
