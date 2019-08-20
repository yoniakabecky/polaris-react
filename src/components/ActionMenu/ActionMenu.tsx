import React from 'react';
import {classNames} from '../../utilities/css';
import {navigationBarCollapsed} from '../../utilities/breakpoints';

import {
  ActionListSection,
  ComplexAction,
  MenuGroupDescriptor,
} from '../../types';

import {MenuAction, MenuGroup, RollupActions} from './components';

import styles from './ActionMenu.scss';

export interface Props {
  /** Compose a custom menu by conditionally nesting either menu groups and menu actions or rollup actions */
  children?: React.ReactNode;
  /** Collection of page-level secondary actions */
  actions?: ComplexAction[];
  /** Collection of page-level action groups */
  groups?: MenuGroupDescriptor[];
  /** Roll up all actions into a Popover > ActionList */
  rollup?: boolean;
}

interface State {
  activeMenuGroup?: string;
}

export const ActionMenuContext = React.createContext({rollup: isMobileView()});

export default class ActionMenu extends React.PureComponent<Props, State> {
  static Group = MenuGroup;
  static Action = MenuAction;
  static Rollup: typeof RollupActions = RollupActions;

  state: State = {
    activeMenuGroup: undefined,
  };

  render() {
    const {
      children,
      actions = [],
      groups = [],
      rollup = isMobileView(),
    } = this.props;

    console.log('MOBILE VIEW? ', rollup);

    if (!children && (actions.length === 0 && groups.length === 0)) {
      return null;
    }

    const actionMenuClassNames = classNames(
      styles.ActionMenu,
      rollup && styles.rollup,
    );

    const rollupSections = groups.map((group) => convertGroupToSection(group));
    const actionMarkup = children ? (
      <div className={styles.ActionsLayout}>{children}</div>
    ) : (
      this.renderActions()
    );

    const menuMarkup = rollup ? (
      <RollupActions items={actions} sections={rollupSections} />
    ) : (
      actionMarkup
    );

    console.log(menuMarkup);

    return (
      <ActionMenuContext.Provider value={{rollup}}>
        <div className={actionMenuClassNames}>{menuMarkup}</div>
      </ActionMenuContext.Provider>
    );
  }

  private renderActions = () => {
    const {actions = [], groups = []} = this.props;
    const {activeMenuGroup} = this.state;

    const actionsMarkup =
      actions.length > 0
        ? actions.map(({content, ...action}, index) => (
            <MenuAction
              key={`MenuAction-${content || index}`}
              content={content}
              {...action}
            />
          ))
        : null;

    const groupsMarkup = hasGroupsWithActions(groups)
      ? groups.map(({title, ...rest}, index) => (
          <MenuGroup
            key={`MenuGroup-${title || index}`}
            title={title}
            active={title === activeMenuGroup}
            {...rest}
            onOpen={this.handleMenuGroupToggle}
            onClose={this.handleMenuGroupClose}
          />
        ))
      : null;

    return actionsMarkup || groupsMarkup ? (
      <div className={styles.ActionsLayout}>
        {actionsMarkup}
        {groupsMarkup}
      </div>
    ) : null;
  };

  private handleMenuGroupToggle = (group: string) => {
    this.setState(({activeMenuGroup}) => ({
      activeMenuGroup: activeMenuGroup ? undefined : group,
    }));
  };

  private handleMenuGroupClose = () => {
    this.setState({activeMenuGroup: undefined});
  };
}

function isMobileView(): boolean {
  return navigationBarCollapsed().matches;
}

export function hasGroupsWithActions(groups: Props['groups'] = []) {
  return groups.length === 0
    ? false
    : groups.some((group) => group.actions.length > 0);
}

export function convertGroupToSection({
  title,
  actions,
}: MenuGroupDescriptor): ActionListSection {
  return {title, items: actions};
}
