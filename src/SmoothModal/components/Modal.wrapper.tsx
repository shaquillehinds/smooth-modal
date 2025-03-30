import { StyleSheet, View } from 'react-native';
import { zIndex } from '../styles/styles.const';
import { type PropsWithChildren } from 'react';

type ModalWrapperProps = {
  enableBackgroundContentPress?: boolean;
};

/** @description Necessary to wrap your modal with an absolute fill view with high z index */
export function ModalWrapper(props: PropsWithChildren<ModalWrapperProps>) {
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
