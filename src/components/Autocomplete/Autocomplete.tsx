import React, {useState} from 'react';

import TextField from '../TextField';
import Popover from '../Popover';

export interface Props {
  /** A unique identifier for the Autocomplete */
  id?: string;
  children: React.ReactNode;
  loading?: boolean;
  allowMultiple?: boolean;
  onScrolledToBottom?(): void;
  onSelect?(index: number): void;
}

export interface AutoCompleteContextType {
  allowMultiple?: boolean;
  loading?: boolean;
  showEmptyState?: boolean;
  onScrolledToBottom?(): void;
  onSelect?(index: number): void;
}

const AutoCompleteContext = React.createContext<AutoCompleteContextType | null>(
  null,
);

export function Autocomplete({
  id,
  children,
  loading,
  onScrolledToBottom,
  onSelect,
  allowMultiple,
}: Props) {
  const context = {
    allowMultiple,
    loading,
    onScrolledToBottom,
    onSelect,
  };

  const [active, setActive] = useState(false);

  // const autoChildren = React.Children.map(children, (child => {
  //   if (child.type === TextField) {
  //     return React.cloneElement(child);
  //   } else if (child.type === TabList) {
  //     return React.cloneElement(child, {
  //       activeIndex: this.state.activeIndex,
  //       onActivateTab: this.handleTabActivate
  //     });
  //   } else {
  //     return child;
  //   }
  // });

  let autoTextField;

  let autoDataList;

  React.Children &&
    React.Children.map(children, (child: React.ReactElement<any>) => {
      if (child && child.type && child.type === <TextField />.type) {
        autoTextField = React.cloneElement(child);
      }
      if (child && child.type && child.type === <DataList />.type) {
        autoDataList = React.cloneElement(child);
      }
    });

  if (!autoTextField) return null;

  return (
    <AutoCompleteContext.Provider value={context}>
      <Popover
        active={active}
        activator={autoTextField}
        onClose={() => setActive(false)}
      >
        {autoDataList}
      </Popover>
    </AutoCompleteContext.Provider>
  );
}

export function DataList({children}: Props) {
  return <ul>{children}</ul>;
}

export function Title({children}: Props) {
  return <li>{children}</li>;
}

export function EmptyState({children}: Props) {
  return <li>{children}</li>;
}

export function Action({children}: Props) {
  return <li>{children}</li>;
}

export function Option({children}: Props) {
  return <li>{children}</li>;
}

Autocomplete.TextField = TextField;
Autocomplete.DataList = DataList;
Autocomplete.Action = Action;
Autocomplete.Option = Option;
Autocomplete.Title = Title;
Autocomplete.EmptyState = EmptyState;
