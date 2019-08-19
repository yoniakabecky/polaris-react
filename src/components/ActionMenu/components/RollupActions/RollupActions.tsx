import React, {useState, memo, useCallback} from 'react';
import {HorizontalDotsMinor} from '@shopify/polaris-icons';

import {ActionListSection, ActionListItemDescriptor} from '../../../../types';

import ActionList from '../../../ActionList';
import Button from '../../../Button';
import Popover from '../../../Popover';
import {useI18n} from '../../../../utilities/i18n';

import styles from './RollupActions.scss';

export interface Props {
  /** Collection of actions for the list */
  items?: ActionListItemDescriptor[];
  /** Collection of sectioned action items */
  sections?: ActionListSection[];
}

function RollupActions({items = [], sections = []}: Props) {
  const [rollupOpen, setRollupOpen] = useState(false);
  const {translate} = useI18n();

  const handleRollupToggle = useCallback(
    () => {
      setRollupOpen(!rollupOpen);
    },
    [rollupOpen],
  );

  if (items.length === 0 && sections.length === 0) {
    return null;
  }

  const activatorMarkup = (
    <div className={styles.RollupActivator}>
      <Button
        plain
        icon={HorizontalDotsMinor}
        accessibilityLabel={translate(
          'Polaris.ActionMenu.RollupActions.rollupButton',
        )}
        onClick={handleRollupToggle}
      />
    </div>
  );

  return (
    <Popover
      active={rollupOpen}
      activator={activatorMarkup}
      preferredAlignment="right"
      onClose={handleRollupToggle}
    >
      <ActionList
        items={items}
        sections={sections}
        onActionAnyItem={handleRollupToggle}
      />
    </Popover>
  );
}

export default memo(RollupActions);
