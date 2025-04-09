import { Modal, StyleSheet, View } from 'react-native';
import { zIndex } from '../styles/styles.const';
import { type PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type ModalWrapperProps = {
  enableBackgroundContentPress?: boolean;
  useNativeModal?: boolean;
};

/** @description Necessary to wrap your modal with an absolute fill view with high z index */
export function ModalWrapper(props: PropsWithChildren<ModalWrapperProps>) {
  if (props.useNativeModal)
    return (
      <Modal visible transparent statusBarTranslucent>
        <GestureHandlerRootView>{props.children}</GestureHandlerRootView>
      </Modal>
    );
  return (
    <View
      pointerEvents={
        props.enableBackgroundContentPress ? 'box-none' : undefined
      }
      style={[StyleSheet.absoluteFill, { zIndex }]}
    >
      {props.children}
    </View>
  );
}
