import {useCallback, useContext, useEffect} from 'react';

import {
  ActionRefsTrackerContext,
  ActionRefsTrackerContextType,
} from './context';

export function useSetActionRefs({
  id: currentId,
  actionRef: currentRef,
}: ActionRefsTrackerContextType) {
  const refsTracker = useContext(ActionRefsTrackerContext);

  const filterRefs = useCallback(() => {
    const itemExists = refsTracker.filter((item) => item.id === currentId)[0];

    if (itemExists) {
      if (itemExists.actionRef?.current === null && currentRef !== null) {
        itemExists.actionRef = currentRef;
      }
    } else {
      refsTracker.push({
        id: currentId,
        actionRef: currentRef,
      });
    }
  }, [refsTracker, currentId, currentRef]);

  useEffect(() => {
    if (currentId && currentRef && currentRef.current !== null) {
      filterRefs();
    }

    console.log(refsTracker, 'useSetActionRefs');
  }, [currentRef, currentId, filterRefs, refsTracker]);
}

export function useActionRefsTrackerContext() {
  const context = useContext(ActionRefsTrackerContext);

  if (!context) {
    throw new Error('No action refs tracker found.');
  }

  return context;
}
