import React, {useState, useCallback} from 'react';

import {getWidth} from '../../../../utilities/get-width';

import {ContextualSaveBarProps as Props} from '../../../../utilities/frame';
import {useI18n} from '../../../../utilities/i18n';
import {useTheme} from '../../../../utilities/theme';
import Button from '../../../Button';
import Image from '../../../Image';
import Stack from '../../../Stack';

import {DiscardConfirmationModal} from './components';

import styles from './ContextualSaveBar.scss';

function ContextualSaveBar({
  alignContentFlush,
  message,
  discardAction,
  saveAction,
}: Props) {
  const {translate} = useI18n();
  const {logo} = useTheme();
  const [
    discardConfirmationModalVisible,
    setDiscardConfirmationModalVisible,
  ] = useState(false);

  const handleDiscardAction = useCallback(
    () => {
      if (discardAction && discardAction.onAction) {
        discardAction.onAction();
      }
      setDiscardConfirmationModalVisible(false);
    },
    [discardAction],
  );

  const toggleDiscardConfirmationModal = useCallback(
    () => {
      setDiscardConfirmationModalVisible(!discardConfirmationModalVisible);
    },
    [discardConfirmationModalVisible],
  );

  const discardActionContent =
    discardAction && discardAction.content
      ? discardAction.content
      : translate('Polaris.ContextualSaveBar.discard');

  let discardActionHandler;
  if (discardAction && discardAction.discardConfirmationModal) {
    discardActionHandler = toggleDiscardConfirmationModal;
  } else if (discardAction) {
    discardActionHandler = discardAction.onAction;
  }

  const discardConfirmationModalMarkup = discardAction &&
    discardAction.onAction &&
    discardAction.discardConfirmationModal && (
      <DiscardConfirmationModal
        open={discardConfirmationModalVisible}
        onCancel={toggleDiscardConfirmationModal}
        onDiscard={handleDiscardAction}
      />
    );

  const discardActionMarkup = discardAction && (
    <Button
      url={discardAction.url}
      onClick={discardActionHandler}
      loading={discardAction.loading}
      disabled={discardAction.disabled}
      accessibilityLabel={discardAction.content}
    >
      {discardActionContent}
    </Button>
  );

  const saveActionContent =
    saveAction && saveAction.content
      ? saveAction.content
      : translate('Polaris.ContextualSaveBar.save');

  const saveActionMarkup = saveAction && (
    <Button
      primary
      url={saveAction.url}
      onClick={saveAction.onAction}
      loading={saveAction.loading}
      disabled={saveAction.disabled}
      accessibilityLabel={saveAction.content}
    >
      {saveActionContent}
    </Button>
  );

  const width = getWidth(logo, 104);

  const imageMarkup = logo && (
    <Image style={{width}} source={logo.contextualSaveBarSource || ''} alt="" />
  );

  const logoMarkup = alignContentFlush ? null : (
    <div className={styles.LogoContainer} style={{width}}>
      {imageMarkup}
    </div>
  );

  return (
    <React.Fragment>
      <div className={styles.ContextualSaveBar}>
        {logoMarkup}
        <div className={styles.Contents}>
          <h2 className={styles.Message}>{message}</h2>
          <div className={styles.ActionContainer}>
            <Stack spacing="tight" wrap={false}>
              {discardActionMarkup}
              {saveActionMarkup}
            </Stack>
          </div>
        </div>
      </div>
      {discardConfirmationModalMarkup}
    </React.Fragment>
  );
}

export default ContextualSaveBar;
