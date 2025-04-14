import Animated from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import { View } from 'react-native';
import { type PropsWithChildren } from 'react';
import { bottomModalStyle as styles } from './bottomSheetModal.styles';
import { type BottomModalControllerReturn } from './controller/bottomModal.controller';
import { type BottomSheetProps } from './bottomSheetModal.types';
import { ModalForegroundWrapper } from '../components/Modal.foreground.wrapper';

export function BottomSheet(
  props: PropsWithChildren<BottomSheetProps> & {
    controller: BottomModalControllerReturn;
  }
) {
  const controller = props.controller;
  return (
    <ModalForegroundWrapper>
      <DragGesture
        disable={props.dragArea !== 'full'}
        onDrag={controller.onDragGesture}
        onDragStart={controller.onDragStartGesture}
        onDragEnd={controller.onDragEndGesture}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            props.style,
            controller.dragAnimatedStyle,
            {
              backgroundColor: props.backgroundColor,
            },
          ]}
        >
          {props.dragArea === 'bumper' || !props.dragArea ? (
            <DragGesture
              onDrag={controller.onDragGesture}
              onDragStart={controller.onDragStartGesture}
              onDragEnd={controller.onDragEndGesture}
            >
              <Bumper {...props} />
            </DragGesture>
          ) : (
            <Bumper {...props} />
          )}
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
      </DragGesture>
    </ModalForegroundWrapper>
  );
}

function Bumper(props: PropsWithChildren<BottomSheetProps>) {
  return (
    <View
      style={[
        styles.bumperContainer,
        { backgroundColor: props.backgroundColor },
        props.bumperContainerStyle,
      ]}
    >
      <View style={[styles.bumper, props.bumperStyle]} />
    </View>
  );
}
