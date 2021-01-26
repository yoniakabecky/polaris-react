import React from 'react';

import {
  ActionRefsTrackerContext,
  useActionRefsTrackerContext,
} from '../../utilities/action-refs-tracker';

interface Props {
  children?: React.ReactNode;
}

export const ActionRefsTrackerProvider = ({children}: Props) => {
  const context = useActionRefsTrackerContext();

  return (
    <ActionRefsTrackerContext.Provider value={context}>
      {children}
    </ActionRefsTrackerContext.Provider>
  );
};
