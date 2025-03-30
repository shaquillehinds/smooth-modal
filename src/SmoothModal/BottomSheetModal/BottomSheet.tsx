import Animated from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import { View } from 'react-native';
import { type PropsWithChildren } from 'react';
import { bottomModalStyle as styles } from './bottomSheetModal.styles';
import { type BottomModalControllerReturn } from './controller/bottomModal.controller';
import { type BottomSheetModalProps } from './bottomSheetModal.types';

export function BottomSheet(
  props: PropsWithChildren<BottomSheetModalProps> & {
    controller: BottomModalControllerReturn;
  }
) {
  const controller = props.controller;
  return (
    <Animated.View
      style={[
        styles.modal,
        props.style,
        controller.dragAnimatedStyle,
        {
          backgroundColor: props.backgroundColor,
        },
      ]}
    >
      <DragGesture
        onDrag={controller.onDragGesture}
        onDragStart={controller.onDragStartGesture}
        onDragEnd={controller.onDragEndGesture}
      >
        <View
          style={[
            styles.bumperContainer,
            { backgroundColor: props.backgroundColor },
            props.bumperContainerStyle,
          ]}
        >
          <View style={[styles.bumper, props.bumperStyle]} />
        </View>
      </DragGesture>
      <Animated.View
        onLayout={controller.onModalContentLayout}
        style={[
          styles.contentContainer,
          controller.modalContentAnimatedStyle,
          props.contentContainerStyle,
        ]}
      >
        {props.children}
      </Animated.View>
    </Animated.View>
  );
}
