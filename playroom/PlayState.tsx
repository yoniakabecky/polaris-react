import React, {useState, useCallback} from 'react';

export function PlayState<S>({
  state: defaultState,
  children,
}: {
  state: S;
  children(state: S, setState: (newState: S) => void): React.ReactNode;
}) {
  const [state, setState] = useState<S>(defaultState);
  return children(state, setState);
}

export function PlayToggle({
  children,
}: {
  children(toggled: boolean, toggle: () => void): React.ReactNode;
}) {
  const [toggled, setToggled] = useState<boolean>(false);
  const toggle = useCallback(() => setToggled(!toggled), [toggled]);
  return children(toggled, toggle);
}
