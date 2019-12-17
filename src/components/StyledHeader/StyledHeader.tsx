import React, {
  ReactNode,
  useMemo,
  useCallback,
  Fragment,
  useEffect,
  RefObject,
} from 'react';
import {EnableSelectionMinor} from '@shopify/polaris-icons';
import debounce from 'lodash/debounce';
import {getRectForNode, Rect} from '@shopify/javascript-utilities/geometry';
// eslint-disable-next-line shopify/strict-component-boundaries
import {
  BulkActions,
  BulkActionsProps,
  CheckableButton,
} from '../ResourceList/components';
import {Select, SelectOption} from '../Select';
import {Button} from '../Button';
import {Sticky} from '../Sticky';
import {Stack} from '../Stack';
import {Spinner} from '../Spinner';
import {useI18n} from '../../utilities/i18n';
import {classNames} from '../../utilities/css';
import {useMediaQuery} from '../../utilities/media-query';
import {useResourceManagerForHeader, SelectionType} from '../ResourceManager';

import styles from './StyledHeader.scss';

// is itemCount the same as selectedItemsCount ????

export interface StyledHeaderProps {
  promotedBulkActions?: BulkActionsProps['promotedActions'];
  bulkActions?: BulkActionsProps['actions'];
  showHeader?: boolean;
  sortOptions?: SelectOption[];
  sortValue?: string;
  alternateTool?: React.ReactNode;
  itemsOnPage: number;
  totalItemsCount: number;
  selectedItemsCount: number | 'ALL';
  filterControl?: ReactNode;
  columnHeaders?: ReactNode;
  onSortChange?(selected: string, id: string): void;
}

const SELECT_ALL_ITEMS = 'ALL';

export function StyledHeader({
  promotedBulkActions,
  bulkActions,
  showHeader = false,
  selectedItemsCount,
  sortOptions,
  sortValue,
  alternateTool,
  onSortChange,
  itemsOnPage,
  totalItemsCount,
  columnHeaders,
  filterControl,
}: StyledHeaderProps) {
  const {
    loading,
    selectable,
    selectMode,
    resourceName,
    resourceManagerNode,
    onSelection,
    onSelectMode,
    onSelectable,
  } = useResourceManagerForHeader();
  useSticky(resourceManagerNode);
  const i18n = useI18n();
  const {resourceListSmallScreen} = useMediaQuery();

  useEffect(() => {
    const shouldShowSelectable = Boolean(
      (promotedBulkActions && promotedBulkActions.length > 0) ||
        (bulkActions && bulkActions.length > 0),
    );

    if (shouldShowSelectable !== selectable) onSelectable(shouldShowSelectable);
  }, [bulkActions, onSelectable, promotedBulkActions, selectable]);

  const filterControlMarkup = filterControl && (
    <div className={styles.FiltersWrapper}>{filterControl}</div>
  );

  let headerTitle = '';
  const resource =
    !loading &&
    ((!totalItemsCount && itemsOnPage === 1) || totalItemsCount === 1)
      ? resourceName.singular
      : resourceName.plural;

  if (loading) {
    headerTitle = i18n.translate('Polaris.ResourceList.loading', {resource});
  } else if (totalItemsCount) {
    headerTitle = i18n.translate('Polaris.ResourceList.showingTotalCount', {
      itemsCount: itemsOnPage,
      totalItemsCount,
      resource,
    });
  } else {
    headerTitle = i18n.translate('Polaris.ResourceList.showing', {
      itemsCount: itemsOnPage,
      resource,
    });
  }

  const handleSelectAllItemsInStore = useCallback(() => {
    onSelection(
      selectedItemsCount === SELECT_ALL_ITEMS
        ? SelectionType.Page
        : SelectionType.All,
      true,
    );
  }, [onSelection, selectedItemsCount]);

  const headerWrapperOverlay = loading && (
    <div className={styles.LoadingPanel}>
      <Stack>
        <Spinner size="small" />
        <span>
          {i18n.translate(
            'Polaris.ResourceList.resourceLoadingAccessibilityLabel',
            {
              resourceNamePlural: resourceName.plural,
            },
          )}
        </span>
      </Stack>
    </div>
  );

  const paginatedSelectAllAction = useMemo(() => {
    if (!selectable || itemsOnPage === totalItemsCount) return;

    const content =
      selectedItemsCount === SELECT_ALL_ITEMS
        ? i18n.translate('Polaris.Common.undo')
        : i18n.translate('Polaris.ResourceList.selectAllItems', {
            itemsLength: itemsOnPage,
            resourceNamePlural: resourceName.plural,
          });

    return {content, onAction: handleSelectAllItemsInStore};
  }, [
    handleSelectAllItemsInStore,
    i18n,
    itemsOnPage,
    resourceName.plural,
    selectable,
    selectedItemsCount,
    totalItemsCount,
  ]);

  const bulkActionsAccessibilityLabel = useMemo(() => {
    const allSelected = selectedItemsCount === totalItemsCount;
    if (totalItemsCount === 1 && allSelected) {
      return i18n.translate(
        'Polaris.ResourceList.a11yCheckboxDeselectAllSingle',
        {resourceNameSingular: resourceName.singular},
      );
    } else if (totalItemsCount === 1) {
      return i18n.translate(
        'Polaris.ResourceList.a11yCheckboxSelectAllSingle',
        {
          resourceNameSingular: resourceName.singular,
        },
      );
    } else if (allSelected) {
      return i18n.translate(
        'Polaris.ResourceList.a11yCheckboxDeselectAllMultiple',
        {
          itemsLength: itemsOnPage,
          resourceNamePlural: resourceName.plural,
        },
      );
    } else {
      return i18n.translate(
        'Polaris.ResourceList.a11yCheckboxSelectAllMultiple',
        {
          itemsLength: itemsOnPage,
          resourceNamePlural: resourceName.plural,
        },
      );
    }
  }, [
    i18n,
    itemsOnPage,
    resourceName.plural,
    resourceName.singular,
    selectedItemsCount,
    totalItemsCount,
  ]);

  const bulkSelectState = useMemo(() => {
    let selectState: boolean | 'indeterminate' = 'indeterminate';
    if (selectedItemsCount === 0) {
      selectState = false;
    } else if (
      selectedItemsCount === SELECT_ALL_ITEMS ||
      selectedItemsCount === itemsOnPage
    ) {
      selectState = true;
    }
    return selectState;
  }, [itemsOnPage, selectedItemsCount]);

  const handleTogglePage = useCallback(() => {
    const selection = Boolean(
      !bulkSelectState || bulkSelectState === 'indeterminate',
    );
    onSelection(SelectionType.Page, selection);

    onSelectMode(selection);
  }, [bulkSelectState, onSelectMode, onSelection]);

  const bulkActionsMarkup = selectable && (
    <div className={styles.BulkActionsWrapper}>
      <BulkActions
        label={i18n.translate('Polaris.ResourceList.selected', {
          selectedItemsCount:
            selectedItemsCount === SELECT_ALL_ITEMS
              ? `${itemsOnPage}+`
              : selectedItemsCount,
        })}
        accessibilityLabel={bulkActionsAccessibilityLabel}
        selected={bulkSelectState}
        onToggleAll={handleTogglePage}
        selectMode={selectMode}
        onSelectModeToggle={onSelectMode}
        promotedActions={promotedBulkActions}
        paginatedSelectAllAction={paginatedSelectAllAction}
        paginatedSelectAllText={
          selectable &&
          itemsOnPage !== totalItemsCount &&
          selectedItemsCount === SELECT_ALL_ITEMS
            ? i18n.translate('Polaris.ResourceList.allItemsSelected', {
                itemsLength: itemsOnPage,
                resourceNamePlural: resourceName.plural,
              })
            : undefined
        }
        actions={bulkActions}
        disabled={loading}
        smallScreen={resourceListSmallScreen}
      />
    </div>
  );

  const sortingSelectMarkup = sortOptions &&
    sortOptions.length > 0 &&
    !alternateTool && (
      <div className={styles.SortWrapper}>
        <Select
          label={i18n.translate('Polaris.ResourceList.sortingLabel')}
          labelInline={!resourceListSmallScreen}
          labelHidden={resourceListSmallScreen}
          options={sortOptions}
          onChange={onSortChange}
          value={sortValue}
          disabled={selectMode}
        />
      </div>
    );

  const headingsMarkup = columnHeaders && (
    <div className={styles.ColumnHeaders}>{columnHeaders}</div>
  );

  const needsHeader =
    selectable ||
    (sortOptions && sortOptions.length > 0) ||
    alternateTool ||
    Boolean(columnHeaders);

  const alternateToolMarkup = alternateTool && !sortingSelectMarkup && (
    <div className={styles.AlternateToolWrapper}>{alternateTool}</div>
  );

  const headerTitleMarkup = (
    <div className={styles.HeaderTitleWrapper} testID="headerTitleWrapper">
      {headerTitle}
    </div>
  );

  const checkableButtonMarkup = selectable && (
    <div className={styles.CheckableButtonWrapper}>
      <CheckableButton
        accessibilityLabel={bulkActionsAccessibilityLabel}
        label={headerTitle}
        onToggleAll={handleTogglePage}
        plain
        disabled={loading}
        labelHidden={Boolean(columnHeaders)}
      />
    </div>
  );

  const selectButtonMarkup = selectable && (
    <div className={styles.SelectButtonWrapper}>
      <Button
        disabled={selectMode}
        icon={EnableSelectionMinor}
        onClick={() => onSelectMode(true)}
      >
        {i18n.translate('Polaris.ResourceList.selectButtonText')}
      </Button>
    </div>
  );

  // const headerMarkup = (showHeader || needsHeader) && (
  //   <div className={styles.HeaderOuterWrapper}>
  //     <Sticky boundingElement={resourceManagerNode.current}>
  //       {(isSticky: boolean) => {
  //         const headerClassName = classNames(
  //           styles.HeaderWrapper,
  //           sortOptions &&
  //             sortOptions.length > 0 &&
  //             !alternateTool &&
  //             styles['HeaderWrapper-hasSort'],
  //           alternateTool && styles['HeaderWrapper-hasAlternateTool'],
  //           selectable && styles['HeaderWrapper-hasSelect'],
  //           columnHeaders && styles['HeaderWrapper-hasHeadings'],
  //           filterControl && styles['HeaderWrapper-hasFilters'],
  //           loading && styles['HeaderWrapper-disabled'],
  //           selectable && selectMode && styles['HeaderWrapper-inSelectMode'],
  //           isSticky && styles['HeaderWrapper-isSticky'],
  //         );
  //         return (
  //           <div className={headerClassName} testID="ResourceList-Header">
  //             {headerWrapperOverlay}
  //             <div className={styles.HeaderContentWrapper}>
  //               {headerTitleMarkup}
  //               {checkableButtonMarkup}
  //               {headingsMarkup}
  //               {alternateToolMarkup}
  //               {sortingSelectMarkup}
  //               {selectButtonMarkup}
  //             </div>
  //             {bulkActionsMarkup}
  //           </div>
  //         );
  //       }}
  //     </Sticky>
  //   </div>
  // );
  const headerClassName = classNames(
    styles.HeaderWrapper,
    sortOptions &&
      sortOptions.length > 0 &&
      !alternateTool &&
      styles['HeaderWrapper-hasSort'],
    alternateTool && styles['HeaderWrapper-hasAlternateTool'],
    selectable && styles['HeaderWrapper-hasSelect'],
    columnHeaders && styles['HeaderWrapper-hasHeadings'],
    filterControl && styles['HeaderWrapper-hasFilters'],
    loading && styles['HeaderWrapper-disabled'],
    selectable && selectMode && styles['HeaderWrapper-inSelectMode'],
  );
  const headerMarkup = (showHeader || needsHeader) && (
    <div className={styles.HeaderOuterWrapper}>
      <div className={headerClassName} testID="ResourceList-Header">
        {headerWrapperOverlay}
        <div className={styles.HeaderContentWrapper}>
          {headerTitleMarkup}
          {checkableButtonMarkup}
          {headingsMarkup}
          {alternateToolMarkup}
          {sortingSelectMarkup}
          {selectButtonMarkup}
        </div>
        {bulkActionsMarkup}
      </div>
    </div>
  );

  return (
    <Fragment>
      {filterControlMarkup}
      {headerMarkup}
    </Fragment>
  );
}

/**
 * DO BULK ACTIONS / BULK ACTINO BUTTON / CHECKABLE BUTTON
 * ADD WEIRD FOCUS LOGIC TO HEADER COMPONENT ???
 *
 * OPTIMIZE ??
 * look into the removed empty state logic???
 * check selected item count usage ?? number rather than  'ALL' ??
 * look into adding a select to filters ????
 */

interface StickyOptions {
  container: Document | React.RefObject<HTMLElement> | HTMLElement;
  offset?: number;
  topbarOffset?: number;
}

function scrollTopFor(container: HTMLElement | Document) {
  return container instanceof Document
    ? document.body.scrollTop ||
        (document.documentElement as HTMLElement).scrollTop
    : container.scrollTop;
}

function useSticky(
  stickyElement: RefObject<HTMLElement>,
  {container, offset, topbarOffset}: Partial<StickyOptions> = {},
) {
  const handleScroll = useCallback(
    debounce(
      () => {
        if (!stickyElement.current) return;
        const stickyContainer =
          (container && 'current' in container && container.current) ||
          (container instanceof HTMLElement && container) ||
          document;
        //  container level numbers
        const scrollTop = scrollTopFor(stickyContainer);
        const containerTop =
          getRectForNode(stickyContainer).top + (topbarOffset || 0);

        // sticky element numbers
        const scrollPosition = scrollTop + (offset || 0);
        const stickyTop =
          stickyElement.current.getBoundingClientRect().top -
          containerTop +
          scrollTop;

        console.log(
          'SCEROLLLLLIN',
          scrollPosition,
          stickyTop,
          scrollPosition >= stickyTop,
        );
      },
      40,
      {leading: true, trailing: true, maxWait: 40},
    ),
    [],
  );

  useEffect(() => {
    const placeholderNode = document.createElement('div');
    placeholderNode.style.paddingBottom = '0px';
    stickyElement.current && stickyElement.current.before(placeholderNode);
  }, []);

  useEffect(() => {
    const stickyContainer =
      (container && 'current' in container && container.current) ||
      (container instanceof HTMLElement && container) ||
      document;

    stickyContainer.addEventListener('scroll', handleScroll);
    return () => stickyContainer.removeEventListener('scroll', handleScroll);
  });
}

// first get value of when to stick ???
