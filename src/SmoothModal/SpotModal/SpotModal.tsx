import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ComponentMounter } from '../components/Component.mounter';
import { ModalWrapper } from '../components/Modal.wrapper';
import { ModalForegroundWrapper } from '../components/Modal.foreground.wrapper';
import { SpotModalController } from './SpotModal.controller';
import type { SmoothSpotModalProps, SpotModalProps } from './SpotModal.types';

export function SpotModal({
  unMountDelayInMilliSeconds,
  onComponentClose,
  onComponentShow,
  mountDefault,
  mountDelayInMilliSeconds,
  ...props
}: SmoothSpotModalProps) {
  return (
    <ComponentMounter
      showComponent={props.showModal}
      setShowComponent={props.setShowModal}
      unMountDelayInMilliSeconds={unMountDelayInMilliSeconds || 500}
      onComponentClose={onComponentClose}
      onComponentShow={onComponentShow}
      mountDefault={mountDefault}
      mountDelayInMilliSeconds={mountDelayInMilliSeconds}
      component={<Modal {...props} />}
    />
  );
}

function Modal(props: SpotModalProps) {
  const controller = SpotModalController(props);
  return (
    <ModalWrapper useNativeModal>
      <TouchableWithoutFeedback onPress={controller.onModalBackdropPress}>
        <View style={[StyleSheet.absoluteFill]} />
      </TouchableWithoutFeedback>
      <ModalForegroundWrapper>
        <Animated.View
          onLayout={controller.onContentLayout}
          style={controller.modalAnimatedStyles}
        >
          {props.children}
        </Animated.View>
      </ModalForegroundWrapper>
    </ModalWrapper>
  );
}
