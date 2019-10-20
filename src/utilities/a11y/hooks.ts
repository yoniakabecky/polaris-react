import {useState, useEffect} from 'react';

export interface UseHiddenNotBlankProps {
  propName: string;
  value: any;
  onError?(error: Error): void;
}

export function useHiddenNotBlank({
  propName,
  value,
  onError = defaultOnError,
}: UseHiddenNotBlankProps) {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (!logged && value === '') {
      const error = new Error(
        // FIXME: We probably want more info here. Ideally a link to A11y info and why we use the ___Hidden props.
        `'${propName}' prop must not be empty string! If you want to hide it, use the '${propName}Hidden' prop.`,
      );

      onError(error);
      setLogged(true);
    }
  }, [propName, value, logged, onError]);
}

function defaultOnError(error: Error) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    throw error;
  } else {
    console.error(error); // eslint-disable-line no-console
  }
}
