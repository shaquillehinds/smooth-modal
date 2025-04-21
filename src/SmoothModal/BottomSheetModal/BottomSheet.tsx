import Animated from 'react-native-reanimated';
import { DragGesture } from '../gestures/Drag.gesture';
import { View } from 'react-native';
import { createContext, type PropsWithChildren } from 'react';
import { bottomModalStyle as styles } from './bottomSheetModal.styles';
import { type BottomModalControllerReturn } from './controller/bottomModal.controller';
import {
  type BottomSheetContextProps,
  type BottomSheetProps,
} from './bottomSheetModal.types';
import { ModalForegroundWrapper } from '../components/Modal.foreground.wrapper';

export const BottomSheetContext = createContext<BottomSheetContextProps | null>(
  null,
);

export function BottomSheet(
  props: PropsWithChildren<BottomSheetProps> & {
    controller: BottomModalControllerReturn;
  },
) {
  const controller = props.controller;
  return (
    <ModalForegroundWrapper>
      <DragGesture
        disable={props.dragArea !== 'full'}
        onDrag={controller.onDragGesture}
        onDragStart={controller.onDragStartGesture}
        onDragEnd={controller.onDragEndGesture}>
        <Animated.View
          style={[
            styles.bottomSheet,
            props.style,
            controller.dragAnimatedStyle,
            {
              backgroundColor: props.backgroundColor,
            },
          ]}>
          {props.dragArea === 'bumper' || !props.dragArea ? (
            <DragGesture
              onDrag={controller.onDragGesture}
              onDragStart={controller.onDragStartGesture}
              onDragEnd={controller.onDragEndGesture}>
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
            ]}>
            <BottomSheetContext.Provider
              value={{
                scrollY: controller.scrollY,
                onBeginScroll: controller.onBeginScroll,
                onUpdateScroll: controller.onUpdateScroll,
                onEndScroll: controller.onEndScroll,
                scrollableComponentRef: controller.scrollableComponentRef,
                maxScrollOffset: controller.maxScrollOffset,
                inverted: controller.inverted,
              }}>
              {props.children}
            </BottomSheetContext.Provider>
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
      ]}>
      <View style={[styles.bumper, props.bumperStyle]} />
    </View>
  );
}
