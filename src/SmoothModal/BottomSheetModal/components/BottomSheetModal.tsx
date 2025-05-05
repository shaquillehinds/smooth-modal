import { ModalBackgroundAnimated } from '../../components/Modal.background.animated';
import { forwardRef, type PropsWithChildren } from 'react';
import { bottomModalStyle as styles } from '../config/bottomSheetModal.styles';
import { ModalWrapper } from '../../components/Modal.wrapper';
import { BottomSheet } from '../components/BottomSheet';
import {
  type BottomSheetModalProps,
  type BottomSheetRef,
} from '../config/bottomSheetModal.types';
import { bottomModalController } from '../controller';

export const BottomSheetModal = forwardRef(
  (props: PropsWithChildren<BottomSheetModalProps>, ref: BottomSheetRef) => {
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
        <BottomSheet {...props} controller={controller} ref={ref}>
          {props.children}
        </BottomSheet>
      </ModalWrapper>
    );
  }
);
