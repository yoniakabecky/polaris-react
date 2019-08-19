import React, {memo} from 'react';

import DisplayText from '../DisplayText';
import TextStyle from '../TextStyle';
import Image from '../Image';
import Stack from '../Stack';
import {useI18n} from '../../utilities/i18n';

import {emptySearch} from './illustrations';
import styles from './EmptySearchResult.scss';

export interface Props {
  title: string;
  description?: string;
  withIllustration?: boolean;
}

function EmptySearchResult({title, description, withIllustration}: Props) {
  const {translate} = useI18n();
  const altText = translate('Polaris.EmptySearchResult.altText');

  const descriptionMarkup = description ? <p>{description}</p> : null;

  const illustrationMarkup = withIllustration ? (
    <Image
      alt={altText}
      source={emptySearch}
      className={styles.Image}
      draggable={false}
    />
  ) : null;

  return (
    <Stack alignment="center" vertical>
      {illustrationMarkup}
      <DisplayText size="small">{title}</DisplayText>
      <TextStyle variation="subdued">{descriptionMarkup}</TextStyle>
    </Stack>
  );
}

export default memo(EmptySearchResult);
