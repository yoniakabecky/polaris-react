import * as React from 'react';
import {classNames} from '../../../../../../utilities/css';
import {Props as AvatarProps} from '../../../../../Avatar';
import {Props as ThumbnailProps} from '../../../../../Thumbnail';
import DisplayText from '../../../../../DisplayText';

import styles from './Title.scss';

export interface BaseProps {
  /** Page subtitle, in regular type*/
  subtitle?: string;
  /** Important and non-interactive status information shown immediately after the title. (stand-alone app use only) */
  titleMetadata?: React.ReactNode;
  /** thumbnail that precedes the title */
  thumbnail?:
    | React.ReactElement<AvatarProps | ThumbnailProps>
    | React.SFC<React.SVGProps<SVGSVGElement>>;
}

interface Props extends BaseProps {
  /** Page title, in large type */
  children: string;
}

export default function Title({
  children,
  subtitle,
  titleMetadata,
  thumbnail,
}: Props) {
  const titleMarkup = (
    <div className={styles.Title}>
      <DisplayText size="large" element="h1">
        {children}
      </DisplayText>
    </div>
  );

  const titleMetadataMarkup = titleMetadata ? (
    <div className={styles.TitleMetadata}>{titleMetadata}</div>
  ) : null;

  const wrappedTitleMarkup = titleMetadata ? (
    <div className={styles.TitleWithMetadataWrapper}>
      {titleMarkup}
      {titleMetadataMarkup}
    </div>
  ) : (
    titleMarkup
  );

  const subtitleMarkup = subtitle ? (
    <div className={styles.SubTitle}>
      <p>{subtitle}</p>
    </div>
  ) : null;

  const thumbnailMarkup = thumbnail ? <div>{thumbnail}</div> : null;

  const pageTitleClassName = thumbnail
    ? classNames(styles.hasThumbnail)
    : undefined;

  return (
    <div className={pageTitleClassName}>
      {thumbnailMarkup}
      <div className={styles.TitleAndSubtitleWrapper}>
        {wrappedTitleMarkup}
        {subtitleMarkup}
      </div>
    </div>
  );
}
