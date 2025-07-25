import { ModalBackgroundAnimated } from '../../components/Modal.background.animated';
import { forwardRef, type PropsWithChildren } from 'react';
import { bottomModalStyle as styles } from '../config/bottomSheetModal.styles';
import { ModalWrapper } from '../../components/Modal.wrapper';
import { BottomSheet } from '../components/BottomSheet';
import {
  type BottomSheetModalProps,
  type SmoothBottomSheetRefObject,
} from '../config/bottomSheetModal.types';
import { bottomModalController } from '../controller';

export const BottomSheetModal = forwardRef(
  (
    props: PropsWithChildren<BottomSheetModalProps>,
    ref: SmoothBottomSheetRefObject
  ) => {
    const controller = bottomModalController(props);
    return (
      <ModalWrapper
        useNativeModal={props.useNativeModal}
        enableBackgroundContentPress={props.enableBackgroundContentPress}
        onRequestClose={controller.onRequestClose}
        disableAndroidBackButton={props.disableAndroidBackButton}
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
            blurBackdrop={props.blurBackdrop}
            disableBlurWarning={props.disableBlurWarning}
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
