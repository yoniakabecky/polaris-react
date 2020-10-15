import React from 'react';
import {CancelSmallMinor} from '@shopify/polaris-icons';

import type {Action} from '../../types';
import {Card} from '../Card';
import {TextContainer} from '../TextContainer';
import {ButtonGroup} from '../ButtonGroup';
import {Button, buttonFrom} from '../Button';
import {Heading} from '../Heading';

import styles from './CalloutCard.scss';

export interface CalloutCardProps {
  /** The content to display inside the callout card. */
  children?: React.ReactNode;
  /** The title of the card */
  title: string;
  /** URL to the card illustration */
  illustration: string;
  /** Primary action for the card */
  primaryAction: Action;
  /** Secondary action for the card */
  secondaryAction?: Action;
  /** Callback when banner is dismissed */
  onDismiss?(): void;
  actionsDescription: string;
}

export function CalloutCard({
  title,
  children,
  primaryAction,
  secondaryAction,
  onDismiss,
  actionsDescription,
}: CalloutCardProps) {
  const primaryActionMarkup = buttonFrom(primaryAction);
  const secondaryActionMarkup = secondaryAction
    ? buttonFrom(secondaryAction, {plain: true})
    : null;

  const buttonMarkup = secondaryActionMarkup ? (
    <ButtonGroup>
      {primaryActionMarkup}
      {secondaryActionMarkup}
    </ButtonGroup>
  ) : (
    primaryActionMarkup
  );

  const dismissButton = onDismiss ? (
    <div className={styles.Dismiss}>
      <Button
        plain
        icon={CancelSmallMinor}
        onClick={onDismiss}
        accessibilityLabel="Dismiss card"
      />
    </div>
  ) : null;

  return (
    <Card>
      <div className={styles.Container}>
        {dismissButton}
        <Card.Section>
          <div className={styles.Title}>
            <Heading>{title}</Heading>
          </div>
          <TextContainer>{children}</TextContainer>
        </Card.Section>
        <Card.Section>
          <div className={styles.CalloutCard}>
            <div className={styles.Content}>
              <div className={styles.Footer}>
                <TextContainer>{actionsDescription}</TextContainer>
                <div>{buttonMarkup}</div>
              </div>
            </div>
          </div>
        </Card.Section>
      </div>
    </Card>
  );
}
