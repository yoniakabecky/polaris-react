import React from 'react';
import {AppProvider} from '../src';

interface Props {
  children: React.ReactNode;
}

const stateStore = {};
let stateUpdater = () => null;
function state(name: string, value: boolean | string) {
  if (typeof value !== 'undefined') {
    return () => {
      stateStore[name] = value;
      stateUpdater();
    };
  }
  return stateStore[name];
}
(window as any).state = state;

export default class PlayroomAppProvider extends React.Component<Props> {
  componentWillMount() {
    stateUpdater = () => this.forceUpdate();
  }

  render() {
    const {children} = this.props;
    return <AppProvider>{children}</AppProvider>;
  }
}
