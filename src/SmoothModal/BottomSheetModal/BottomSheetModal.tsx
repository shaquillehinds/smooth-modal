import { ModalBackgroundAnimated } from '../components/Modal.background.animated';
import { type PropsWithChildren } from 'react';
import { bottomModalStyle as styles } from './bottomSheetModal.styles';
import { ModalWrapper } from '../components/Modal.wrapper';
import { bottomModalController } from './controller/bottomModal.controller';
import { BottomSheet } from './BottomSheet';
import { type BottomSheetModalProps } from './bottomSheetModal.types';

export function BottomSheetModal(
  props: PropsWithChildren<BottomSheetModalProps>
) {
  const controller = bottomModalController(props);
  return (
    <ModalWrapper
      useNativeModal={props.useNativeModal}
      enableBackgroundContentPress={props.enableBackgroundContentPress}
    >
      {!props.enableBackgroundContentPress ? (
        <ModalBackgroundAnimated
          onPress={
            props.disableCloseOnBackdropPress
              ? undefined
              : controller.onModalBackdropPress
          }
          style={styles.background}
          animatedStyle={controller.backdropOpacityStyle}
          avoidStatusBar={props.useNativeModal}
        >
          {props.BackdropComponent}
        </ModalBackgroundAnimated>
      ) : undefined}
      <BottomSheet {...props} controller={controller}>
        {props.children}
      </BottomSheet>
    </ModalWrapper>
  );
}
