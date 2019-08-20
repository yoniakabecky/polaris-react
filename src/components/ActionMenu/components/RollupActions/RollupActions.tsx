import React from 'react';
import {HorizontalDotsMinor} from '@shopify/polaris-icons';

import {ActionListSection, ActionListItemDescriptor} from '../../../../types';

import {
  withAppProvider,
  WithAppProviderProps,
} from '../../../../utilities/with-app-provider';
import ActionList from '../../../ActionList';
import Button from '../../../Button';
import Popover from '../../../Popover';

import {ActionMenuContext} from '../../ActionMenu';

import styles from './RollupActions.scss';

export interface Props {
  /** Collection of actions for the list */
  items?: ActionListItemDescriptor[];
  /** Collection of sectioned action items */
  sections?: ActionListSection[];
}

export type CombinedProps = Props & WithAppProviderProps;

interface State {
  rollupOpen: boolean;
}

class RollupActions extends React.PureComponent<CombinedProps, State> {
  state: State = {
    rollupOpen: false,
  };

  render() {
    const {
      items = [],
      sections = [],
      polaris: {intl},
    } = this.props;
    const {rollupOpen} = this.state;

    if (items.length === 0 && sections.length === 0) {
      return null;
    }

    const activatorMarkup = (
      <div className={styles.RollupActivator}>
        <Button
          plain
          icon={HorizontalDotsMinor}
          accessibilityLabel={intl.translate(
            'Polaris.ActionMenu.RollupActions.rollupButton',
          )}
          onClick={this.handleRollupToggle}
        />
      </div>
    );

    return (
      <ActionMenuContext.Consumer>
        {({rollup}) => {
          return rollup ? (
            <Popover
              active={rollupOpen}
              activator={activatorMarkup}
              preferredAlignment="right"
              onClose={this.handleRollupToggle}
            >
              <ActionList
                items={items}
                sections={sections}
                onActionAnyItem={this.handleRollupToggle}
              />
            </Popover>
          ) : null;
        }}
      </ActionMenuContext.Consumer>
    );
  }

  private handleRollupToggle = () => {
    this.setState(({rollupOpen}) => ({rollupOpen: !rollupOpen}));
  };
}

export default withAppProvider<Props>()(RollupActions);
