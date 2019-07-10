import React, {useState} from 'react';

import TextField from '../TextField';
import Popover from '../Popover';

export interface Props {
  /** A unique identifier for the Autocomplete */
  id?: string;
  children?: React.ReactNode;
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

export default function Autocomplete({
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

  const autoTextField = React.Children && React.Children.toArray(children);
  console.log(autoTextField);
  // .filter(
  //   (child: any) => child.type === TextField,
  // )[0];

  const autoDataList =
    React.Children &&
    React.Children.toArray(children).filter(
      (child: any) => child.type === DataList,
    )[0];

  return (
    <AutoCompleteContext.Provider value={context}>
      <Popover
        active={active}
        activator={autoTextField as React.ReactElement}
        onClose={() => setActive(false)}
      >
        {autoDataList}
      </Popover>
      {children}
    </AutoCompleteContext.Provider>
  );
}

function DataList({children}: Props) {
  return <ul>{children}</ul>;
}

function Title({children}: Props) {
  return <li>{children}</li>;
}

function EmptyState({children}: Props) {
  return <li>{children}</li>;
}

function Action({children}: Props) {
  return <li>{children}</li>;
}

function Option({children}: Props) {
  return <li>{children}</li>;
}

Autocomplete.TextField = TextField;
Autocomplete.DataList = DataList;
Autocomplete.Action = Action;
Autocomplete.Option = Option;
Autocomplete.Title = Title;
Autocomplete.EmptyState = EmptyState;
