import React, {memo, useCallback} from 'react';

import {classNames} from '../../../../utilities/css';
import {layer} from '../../../shared';
import PositionedOverlay, {
  OverlayDetails,
  PreferredPosition,
} from '../../../PositionedOverlay';

import styles from '../../Tooltip.scss';

export interface Props {
  id: string;
  active: boolean;
  light?: boolean;
  preferredPosition?: PreferredPosition;
  children?: React.ReactNode;
  activator: HTMLElement;
  onClose(): void;
}

function TooltipOverlay({
  active,
  id,
  children,
  light,
  activator,
  preferredPosition = 'below',
}: Props) {
  const renderTooltip = useCallback(
    (overlayDetails: OverlayDetails) => {
      const {measuring, desiredHeight, positioning} = overlayDetails;

      const containerClassName = classNames(
        styles.Tooltip,
        light && styles.light,
        measuring && styles.measuring,
        positioning === 'above' && styles.positionedAbove,
      );

      const contentStyles = measuring ? undefined : {minHeight: desiredHeight};

      return (
        <div className={containerClassName} {...layer.props}>
          <div className={styles.Wrapper}>
            <div
              id={id}
              role="tooltip"
              className={styles.Content}
              style={contentStyles}
            >
              {children}
            </div>
          </div>
        </div>
      );
    },
    [children, id, light],
  );

  return active ? renderOverlay() : null;

  function renderOverlay() {
    return (
      <PositionedOverlay
        active={active}
        activator={activator}
        preferredPosition={preferredPosition}
        render={renderTooltip}
      />
    );
  }
}

export default memo(TooltipOverlay);
