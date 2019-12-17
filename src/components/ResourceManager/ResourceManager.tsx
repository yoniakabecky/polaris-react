import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useState,
  RefObject,
} from 'react';
import {useI18n} from '../../utilities/i18n';
import {useMediaQuery} from '../../utilities/media-query';

import styles from './ResourceManager.scss';

export enum SelectionType {
  All = 'all',
  Page = 'page',
  Multi = 'multi',
  Single = 'single',
}

type Range = [number, number];
interface ResourceName {
  singular: string;
  plural: string;
}
type OnSelection = (
  selectionType: SelectionType,
  toggleType: boolean,
  selection?: string | Range,
) => void;
type HandleSelectionChange = (
  selectionType: SelectionType,
  toggleType: boolean,
  selection?: string | Range,
  sortOrder?: number,
) => void;
type HandleSelectMode = (selectMode: boolean) => void;
type HandleSelectable = (nextPossibleSelectable: boolean) => void;

export interface ResourceManagerProps {
  selectable?: boolean;
  resourceName?: ResourceName;
  loading?: boolean;
  children?: ReactNode;
  hasItemsSelected: boolean;
  onSelection?: OnSelection;
}

const ResourceManagerForHeaderContext = createContext<
  | {
      loading: boolean;
      selectable: boolean;
      selectMode: boolean;
      resourceName: ResourceName;
      resourceManagerNode: RefObject<HTMLDivElement>;
      onSelection: HandleSelectionChange;
      onSelectMode: HandleSelectMode;
      onSelectable: HandleSelectable;
    }
  | undefined
>(undefined);
export function useResourceManagerForHeader() {
  const context = useContext(ResourceManagerForHeaderContext);

  if (!context) throw new Error('yolo HEADDDSZcontext Lssssit');

  return context;
}

const ResourceManagerForListContext = createContext<
  | {
      selectMode: boolean;
      loading: boolean;
      resourceName: ResourceName;
    }
  | undefined
>(undefined);
export function useResourceManagerForList() {
  const context = useContext(ResourceManagerForListContext);

  if (!context) throw new Error('yolo context Lssssit');

  return context;
}

const ResourceManagerForItemContext = createContext<
  | {
      selectMode: boolean;
      selectable: boolean;
      resourceName: ResourceName;
      onSelection: HandleSelectionChange;
    }
  | undefined
>(undefined);
export function useResourceManagerForItem() {
  const context = useContext(ResourceManagerForItemContext);

  if (!context) throw new Error('yolo context reosurcelist');

  return context;
}

export function ResourceManager({
  selectable: selectableProp,
  resourceName,
  onSelection,
  hasItemsSelected,
  loading,
  children,
}: ResourceManagerProps) {
  const i18n = useI18n();
  const {resourceListSmallScreen} = useMediaQuery();
  const resourceManagerNode = useRef<HTMLDivElement>(null);
  const defaultResourceName = useRef({
    singular: i18n.translate('Polaris.ResourceList.defaultItemSingular'),
    plural: i18n.translate('Polaris.ResourceList.defaultItemPlural'),
  });

  const [selectable, setSelectable] = useState(selectableProp);
  const [selectMode, setSelectMode] = useState(hasItemsSelected);

  const handleSelectable = useCallback(
    (nextPossibleSelectable) => {
      if (selectable === nextPossibleSelectable) return;
      setSelectable(nextPossibleSelectable);
    },
    [selectable],
  );

  useEffect(() => {
    if (hasItemsSelected && !selectMode) {
      setSelectMode(true);
    } else if (!hasItemsSelected && !resourceListSmallScreen) {
      setSelectMode(false);
    }
  }, [hasItemsSelected, resourceListSmallScreen, selectMode]);

  const lastSelected = useRef<number | null>(null);
  const handleSelection: HandleSelectionChange = useCallback(
    (
      selectionType: SelectionType,
      toggleType: boolean,
      selection?: string | Range,
      sortOrder?: number,
    ) => {
      if (!onSelection) return;

      const prevSelected = lastSelected.current;
      if (SelectionType.Multi && typeof sortOrder === 'number') {
        lastSelected.current = sortOrder;
      }
      if (
        selectionType === SelectionType.Single ||
        (selectionType === SelectionType.Multi &&
          (typeof prevSelected !== 'number' || typeof sortOrder !== 'number'))
      ) {
        onSelection(SelectionType.Single, toggleType, selection);
      } else if (selectionType === SelectionType.Multi) {
        const min = Math.min(prevSelected as number, sortOrder as number);
        const max = Math.max(prevSelected as number, sortOrder as number);
        onSelection(selectionType, toggleType, [min, max]);
      } else if (
        selectionType === SelectionType.Page ||
        selectionType === SelectionType.All
      ) {
        onSelection(selectionType, toggleType);
      }
    },
    [onSelection],
  );

  // Look into just toggling this?
  const handleSelectMode = useCallback(
    (selectMode) => {
      setSelectMode(selectMode);
      if (!selectMode) {
        handleSelection(SelectionType.All, false);
      }
    },
    [handleSelection],
  );

  const contextForHeader = useMemo(
    () => ({
      loading: Boolean(loading),
      selectable: Boolean(selectable || selectableProp),
      onSelection: handleSelection,
      onSelectMode: handleSelectMode,
      onSelectable: handleSelectable,
      resourceName: resourceName || defaultResourceName.current,
      selectMode: hasItemsSelected,
      resourceManagerNode,
    }),
    [
      handleSelectMode,
      handleSelectable,
      handleSelection,
      hasItemsSelected,
      loading,
      resourceName,
      selectable,
      selectableProp,
    ],
  );

  const contextForList = useMemo(
    () => ({
      selectMode: hasItemsSelected,
      loading: Boolean(loading),
      resourceName: resourceName || defaultResourceName.current,
    }),
    [hasItemsSelected, loading, resourceName],
  );

  const contextForItem = useMemo(
    () => ({
      selectMode: hasItemsSelected,
      selectable: Boolean(selectable || selectableProp),
      onSelection: handleSelection,
      resourceName: resourceName || defaultResourceName.current,
    }),
    [
      handleSelection,
      hasItemsSelected,
      resourceName,
      selectable,
      selectableProp,
    ],
  );

  return (
    <ResourceManagerForHeaderContext.Provider value={contextForHeader}>
      <ResourceManagerForListContext.Provider value={contextForList}>
        <ResourceManagerForItemContext.Provider value={contextForItem}>
          <div className={styles.ResourceListWrapper} ref={resourceManagerNode}>
            {children}
          </div>
        </ResourceManagerForItemContext.Provider>
      </ResourceManagerForListContext.Provider>
    </ResourceManagerForHeaderContext.Provider>
  );
}
