import { ModalBackgroundAnimated } from '../components/Modal.background.animated';
import { type PropsWithChildren } from 'react';
import { bottomModalStyle as styles } from './bottomSheetModal.styles';
import { ModalWrapper } from '../components/Modal.wrapper';
import { bottomModalController } from './controller/bottomModal.controller';
import { BottomSheet } from './BottomSheet';
import { type BottomSheetModalProps } from './bottomSheetModal.types';
import { ModalForegroundWrapper } from '../components/Modal.foreground.wrapper';

export function BottomSheetModal(
  props: PropsWithChildren<BottomSheetModalProps>
) {
  const controller = bottomModalController(props);
  return (
    <ModalWrapper>
      <ModalBackgroundAnimated
        onPress={controller.onModalBackdropPress}
        style={styles.background}
        animatedStyle={controller.backdropOpacityStyle}
      />
      <ModalForegroundWrapper>
        <BottomSheet {...props} controller={controller}>
          {props.children}
        </BottomSheet>
      </ModalForegroundWrapper>
    </ModalWrapper>
  );
}
