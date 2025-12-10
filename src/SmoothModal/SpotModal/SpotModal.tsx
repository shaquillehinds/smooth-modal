import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  Press,
  usePortalComponent,
  ComponentMounter,
  ModalWrapper,
  ModalForegroundWrapper,
} from '@shaquillehinds/react-native-essentials';
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
  const portal = usePortalComponent({
    Component: (
      <ComponentMounter
        showComponent={props.showModal}
        setShowComponent={props.setShowModal}
        unMountDelayInMilliSeconds={unMountDelayInMilliSeconds || 250}
        onComponentClose={onComponentClose}
        onComponentShow={onComponentShow}
        mountDefault={mountDefault}
        mountDelayInMilliSeconds={mountDelayInMilliSeconds}
        component={<Modal {...props} disableNativeModal />}
      />
    ),
    name: 'smooth-bottom-modal',
    disable: props.disablePortal,
  });
  if (portal && !props.disablePortal) {
    return <></>;
  } else {
    return (
      <ComponentMounter
        showComponent={props.showModal}
        setShowComponent={props.setShowModal}
        unMountDelayInMilliSeconds={unMountDelayInMilliSeconds || 250}
        onComponentClose={onComponentClose}
        onComponentShow={onComponentShow}
        mountDefault={mountDefault}
        mountDelayInMilliSeconds={mountDelayInMilliSeconds}
        component={<Modal {...props} />}
      />
    );
  }
}

function Modal(props: SpotModalProps) {
  const controller = SpotModalController(props);
  return (
    <ModalWrapper useNativeModal={!props.disableNativeModal}>
      <Press
        stopPropagation
        disableAnimation
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: props.backgroundColor },
        ]}
        onPress={controller.onModalBackdropPress}
      >
        <ModalForegroundWrapper>
          <Animated.View
            onLayout={controller.onContentLayout}
            style={controller.modalAnimatedStyles}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {props.children}
          </Animated.View>
        </ModalForegroundWrapper>
      </Press>
    </ModalWrapper>
  );
}
