import React, {ReactNode, createContext, useContext, useMemo} from 'react';
import {useResourceManagerForList} from '../ResourceManager';
import {EmptySearchResult} from '../EmptySearchResult';
import {classNames} from '../../utilities/css';
import {useI18n} from '../../utilities/i18n';

import styles from './StyledList.scss';

export enum SelectionType {
  All = 'all',
  Page = 'page',
  Multi = 'multi',
  Single = 'single',
}

export type Range = [number, number];

export interface StyledListProps {
  children?: ReactNode;
  // Make this a prop on resource list
  // and have it accept a react node
  fallback?: boolean;
  onClick?(id: string): void;
}

const StyledListContext = createContext<
  {onClick?(id: string): void} | undefined
>(undefined);

export function useStyledListContext() {
  const context = useContext(StyledListContext);
  if (!context) throw new Error('SLLLLTTTEDDD LIST');
  return context;
}

// Maybe have fallback empty state for renders without children?????
export function StyledList({onClick, children}: StyledListProps) {
  const {selectMode, loading, resourceName} = useResourceManagerForList();
  const i18n = useI18n();

  const context = useMemo(() => ({onClick}), [onClick]);

  const emptySearchResultText = useMemo(
    () => ({
      title: i18n.translate('Polaris.ResourceList.emptySearchResultTitle', {
        resourceNamePlural: resourceName.plural,
      }),
      description: i18n.translate(
        'Polaris.ResourceList.emptySearchResultDescription',
      ),
    }),
    [i18n, resourceName.plural],
  );

  const styledListClassNames = classNames(
    styles.StyledList,
    selectMode && styles.disableTextSelection,
  );

  const contentMarkup = children ? (
    <ul className={styledListClassNames} aria-live="polite" aria-busy={loading}>
      {children}
    </ul>
  ) : (
    <div className={styles.EmptySearchResultWrapper}>
      <EmptySearchResult {...emptySearchResultText} withIllustration />
    </div>
  );

  return (
    <StyledListContext.Provider value={context}>
      {contentMarkup}
    </StyledListContext.Provider>
  );
}
