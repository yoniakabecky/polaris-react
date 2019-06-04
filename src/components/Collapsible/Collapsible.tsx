import React, {useState, useRef, useEffect, useCallback} from 'react';
import {durationSlowest as durationBase} from '@shopify/polaris-tokens';
import {
  addEventListener,
  removeEventListener,
} from '@shopify/javascript-utilities/events';
import {classNames} from '@shopify/css-utilities';

import styles from './Collapsible.scss';

export interface Props {
  /** Assign a unique ID to the collapsible. For accessibility, pass this ID as the value of the triggering component’s aria-controls prop. */
  id: string;
  /** Toggle whether the collapsible is expanded or not. */
  open: boolean;
  /** The content to display inside the collapsible. */
  children?: React.ReactNode;
}

export interface State {
  height?: number | null;
}

export function Collapsible({id, open, children}: Props) {
  const [height, setHeight] = useState<number>(0);

  const containerNode = useRef<HTMLDivElement>(null);
  const contentNode = useRef<HTMLDivElement>(null);
  const styleNodeClassName = 'collapse-ease';

  useEffect(
    () => {
      if (!contentNode.current) return;
      setHeight(contentNode.current.offsetHeight);
    },
    [height],
  );

  useEffect(
    () => {
      if (!height || !containerNode.current) return;
      let styleBlock = document.querySelector(`.${styleNodeClassName}`);
      if (!styleBlock) {
        styleBlock = document.createElement('style');
        styleBlock.classList.add(styleNodeClassName);
        document.head.appendChild(styleBlock);
      }
      const keyframeAnimation = createKeyframeAnimation(height);
      styleBlock.textContent = keyframeAnimation;
    },
    [height],
  );

  const handleResize = useCallback(() => {
    if (!contentNode.current) return;
    setHeight(contentNode.current.offsetHeight);
  }, []);

  useEventListener(window, 'resize', handleResize);

  const wrapperClassName = classNames(
    styles.Container,
    containerNode && styles['Container-active'],
    open && styles['Container-expanded'],
    !open && styles['Container-collapsed'],
  );

  const contentClassName = classNames(
    styles.Content,
    open && styles['Content-expanded'],
    !open && styles['Content-collapsed'],
  );

  const containerAnimation = {
    animationName: open
      ? 'containerExpandAnimation'
      : 'containerCollapseAnimation',
  };

  const contentAnimation = {
    animationName: open ? 'contentExpandAnimation' : 'contentCollapseAnimation',
  };

  // if (containerNode.current) {
  //   window.getComputedStyle(containerNode.current).transform;
  // }

  return (
    <div
      id={id}
      aria-hidden={!open}
      style={containerAnimation}
      className={wrapperClassName}
      ref={containerNode}
    >
      <div
        ref={contentNode}
        style={contentAnimation}
        className={contentClassName}
      >
        {children}
      </div>
    </div>
  );
}

export default Collapsible;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function ease(value: number, pow = 4) {
  const height = clamp(value, 0, 1);
  return 1 - Math.pow(1 - height, pow);
}

function appendToAnimation({
  percentage,
  step,
  startY,
  endY,
  outerAnimation,
  innerAnimation,
}: {
  percentage: string;
  step: any;
  startY: number;
  endY: number;
  outerAnimation: string[];
  innerAnimation: string[];
}) {
  const yScale = Number((startY + (endY - startY) * step).toFixed(5));

  const invScaleY = (1 / yScale).toFixed(5);

  outerAnimation.push(`
  ${percentage}% {
    transform: scaleY(${yScale});
  }`);

  innerAnimation.push(`
  ${percentage}% {
    transform: scaleY(${invScaleY});
  }`);
}

function createKeyframeAnimation(height: number) {
  const yScale = 0 / height;
  const duration = durationBase;
  const frameRate = 1000 / 30;
  const numberFrames = Math.round(duration / frameRate);
  const percentIncrement = 100 / numberFrames;

  const containerExpandAnimation: string[] = [];
  const contentExpandAnimation: string[] = [];
  const containerCollapseAnimation: string[] = [];
  const contentCollapseAnimation: string[] = [];

  for (let i = 0; i <= numberFrames; i++) {
    const step: string = ease(i / numberFrames).toFixed(5);
    const percentage: string = (i * percentIncrement).toFixed(5);
    const startY: number = yScale;
    const endY = 1;

    // Expand animation.
    appendToAnimation({
      percentage,
      step,
      startY,
      endY,
      outerAnimation: containerExpandAnimation,
      innerAnimation: contentExpandAnimation,
    });

    // Collapse animation.
    appendToAnimation({
      percentage,
      step,
      startY: 1,
      endY: yScale,
      outerAnimation: containerCollapseAnimation,
      innerAnimation: contentCollapseAnimation,
    });
  }

  return `
    @keyframes containerExpandAnimation {
      ${containerExpandAnimation.join('')}
    }

    @keyframes contentExpandAnimation {
      ${contentExpandAnimation.join('')}
    }

    @keyframes containerCollapseAnimation {
      ${containerCollapseAnimation.join('')}
    }

    @keyframes contentCollapseAnimation {
      ${contentCollapseAnimation.join('')}
    }`;
}

type Node = HTMLElement | Document | Window | null;

function useEventListener(
  node: Node,
  event: string,
  handler: (event: Event) => void,
  capture = false,
  passive = false,
) {
  useEffect(
    () => {
      if (!node) return;
      addEventListener(node, event, handler, {capture, passive});
      return () => {
        if (!node) return;
        removeEventListener(node, event, handler, capture);
      };
    },
    [capture, event, handler, node, passive],
  );
}
