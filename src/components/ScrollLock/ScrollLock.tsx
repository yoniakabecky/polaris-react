import {useEffect} from 'react';
import {useScrollLockManager} from '../../utilities/scroll-lock-manager';

import './ScrollLock.scss';

export interface Props {}
// useScrollLock -> ????????
function ScrollLock() {
  const scrollLockManager = useScrollLockManager();

  useEffect(
    () => {
      scrollLockManager.registerScrollLock();
      return () => {
        scrollLockManager.unregisterScrollLock();
      };
    },
    [scrollLockManager],
  );

  return null;
}

export default ScrollLock;
