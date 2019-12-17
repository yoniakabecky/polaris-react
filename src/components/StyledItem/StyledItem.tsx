import React, {memo, useRef, ReactNode, ReactElement} from 'react';
import {HorizontalDotsMinor} from '@shopify/polaris-icons';

import {Button, buttonsFrom} from '../Button';
import {AvatarProps} from '../Avatar';
import {Checkbox} from '../Checkbox';
import {ThumbnailProps} from '../Thumbnail';
import {ButtonGroup} from '../ButtonGroup';
import {ActionList} from '../ActionList';
import {Popover} from '../Popover';
import {UnstyledLink} from '../UnstyledLink';
import {useStyledListContext, SelectionType} from '../StyledList';
import {useResourceManagerForItem} from '../ResourceManager';
import {DisableableAction} from '../../types';

import {useToggle} from '../../utilities/use-toggle';
import {useI18n} from '../../utilities/i18n';
import {classNames} from '../../utilities/css';

import styles from './StyledItem.scss';

export interface StyledItemProps {
  media?: ReactElement<AvatarProps | ThumbnailProps>;
  shortcutActions?: DisableableAction[];
  persistActions?: boolean;
  selected?: boolean;
  url?: string;
  id: string;
  position?: number;
  children?: ReactNode;

  accessibilityLabel?: string;
  name?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  external?: boolean;
}

export const StyledItem = memo(function StyledItem({
  media,
  shortcutActions,
  persistActions,
  selected,
  url,
  id,
  position,
  children,
  accessibilityLabel,
  name,
  ariaControls,
  ariaExpanded,
  external,
}: StyledItemProps) {
  const styledItem = useRef<HTMLLIElement>(null);
  const i18n = useI18n();
  const {
    value: actionMenuVisible,
    toggle: toggleActionMenuVisible,
    setFalse: closeActionMenuVisible,
  } = useToggle(false);
  const {
    onSelection,
    selectMode,
    selectable,
    resourceName,
  } = useResourceManagerForItem();
  // Make into component ??
  const {onClick} = useStyledListContext();

  const mediaMarkup = media && <div className={styles.Media}>{media}</div>;
  const handleMarkup = selectable && (
    <div
      className={styles.Handle}
      onChange={handleSelection}
      onClick={stopPropagation}
    >
      <Checkbox
        checked={selected}
        label={
          name ||
          accessibilityLabel ||
          i18n.translate('Polaris.Common.checkbox')
        }
        labelHidden
      />
    </div>
  );
  const ownedMarkup = (media || selectable) && (
    <div className={styles.Owned}>
      {handleMarkup}
      {mediaMarkup}
    </div>
  );
  // End of component ??

  // Maybe component ??
  const actionsMarkup = shortcutActions && (
    // Add styles after
    <div className={styles.Actions} onClick={stopPropagation}>
      <ButtonGroup segmented={!persistActions}>
        {buttonsFrom(shortcutActions, {
          plain: Boolean(persistActions),
          size: persistActions ? 'medium' : 'slim',
        })}
      </ButtonGroup>
    </div>
  );
  const disclosureMarkup = actionsMarkup && persistActions && (
    <div className={styles.Disclosure} onClick={stopPropagation}>
      <Popover
        activator={
          <Button
            accessibilityLabel={
              name
                ? i18n.translate(
                    'Polaris.ResourceList.Item.actionsDropdownLabel',
                    {
                      accessibilityLabel: name,
                    },
                  )
                : i18n.translate('Polaris.ResourceList.Item.actionsDropdown')
            }
            onClick={toggleActionMenuVisible}
            plain
            icon={HorizontalDotsMinor}
          />
        }
        onClose={closeActionMenuVisible}
        active={actionMenuVisible}
      >
        <ActionList items={shortcutActions} />
      </Popover>
    </div>
  );
  // End of component ??

  const content = children && <div className={styles.Content}>{children}</div>;

  const accessibleProps = {
    ...(url
      ? {'aria-describedby': id, url, external}
      : {
          'aria-controls': ariaControls,
          'aria-expanded': ariaExpanded,
          onClick: handleClick,
        }),
    'aria-label':
      accessibilityLabel ||
      i18n.translate('Polaris.ResourceList.Item.viewItem', {
        itemName: name || (resourceName && resourceName.singular) || '',
      }),
    className: styles.Overlay,
  };

  const AccessibleTag = url ? UnstyledLink : 'button';
  const accessibleMarkup = <AccessibleTag {...accessibleProps} />;

  const styledItemClassName = classNames(
    styles.StyledItem,
    persistActions && styles.persistActions,
    selectMode && styles.selectMode,
    selectable && styles.selectable,
    selected && styles.selected,
  );

  return (
    <li
      className={styledItemClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={styledItem}
    >
      {accessibleMarkup}
      <div className={styles.FocusLine} />
      <div className={styles.Container} id={id}>
        {ownedMarkup}
        {content}
        {actionsMarkup}
        {disclosureMarkup}
      </div>
    </li>
  );

  function handleClick(event: React.MouseEvent<any>) {
    stopPropagation(event);
    const {ctrlKey, metaKey} = event.nativeEvent;
    const anchor = styledItem.current && styledItem.current.querySelector('a');

    if (selectMode) {
      handleSelection(event);
      return;
    }

    if (anchor === event.target) return;

    if (onClick) {
      onClick(id);
    }

    if (url && (ctrlKey || metaKey)) {
      window.open(url, '_blank');
      return;
    }

    if (url && anchor) anchor.click();
  }

  function handleKeyDown({key}: React.KeyboardEvent) {
    key === 'Enter' && url && !selectMode && onClick && onClick(id);
  }

  function handleSelection(
    event: React.MouseEvent | React.KeyboardEvent | React.FormEvent<any>,
  ) {
    stopPropagation(event);
    if (('key' in event && event.key !== ' ') || !onSelection) return;
    const selectionType =
      'shiftKey' in event.nativeEvent && event.nativeEvent.shiftKey
        ? SelectionType.Multi
        : SelectionType.Single;

    onSelection(selectionType, !selected, id, position);
  }
});

StyledItem.whyDidYouRender = true;

function stopPropagation(
  event: React.MouseEvent | React.KeyboardEvent | React.FormEvent,
) {
  event.stopPropagation();
}
