import Animated, { runOnUI } from 'react-native-reanimated';
import { DragGesture } from '../../gestures/Drag.gesture';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  forwardRef,
  createContext,
  useImperativeHandle,
  type PropsWithChildren,
} from 'react';
import { bottomModalStyle as styles } from '../config/bottomSheetModal.styles';
import { type BottomModalControllerReturn } from '../controller/bottomModal.controller';
import {
  type BottomSheetContextProps,
  type BottomSheetProps,
  type SmoothBottomSheetRefObject,
} from '../config/bottomSheetModal.types';
import { ModalForegroundWrapper } from '../../components/Modal.foreground.wrapper';
import { ComponentMounter } from '../../components/Component.mounter';

export const BottomSheetContext = createContext<BottomSheetContextProps | null>(
  null
);

export const BottomSheet = forwardRef(
  (
    props: PropsWithChildren<BottomSheetProps> & {
      controller: BottomModalControllerReturn;
    },
    ref: SmoothBottomSheetRefObject
  ) => {
    const controller = props.controller;
    useImperativeHandle(
      ref,
      () => ({
        animateCloseModal: (prop) => {
          controller.disableLayoutAnimation.current = true;
          runOnUI(controller.animateModalClose)(prop);
        },
        snapToIndex: (snapPointIndex) => {
          runOnUI(controller.animateToSnapPointIndex)(snapPointIndex);
        },
        snapToPercentage: (percentage) => {
          runOnUI(controller.animateToPercentage)(
            percentage,
            controller.screenHeight
          );
        },
      }),
      [controller.screenHeight]
    );
    const style: StyleProp<ViewStyle> = {
      bottom:
        controller.modalDimensionsStyle.bottom + (props.bottomOffset || 0),
    };
    if (props.backgroundColor) style.backgroundColor = props.backgroundColor;
    return (
      <ModalForegroundWrapper>
        <DragGesture
          minDistance={15}
          disable={props.dragArea !== 'full'}
          onDrag={controller.onDragGesture}
          onDragStart={controller.onDragStartGesture}
          onDragEnd={controller.onDragEndGesture}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              props.style,
              controller.modalDimensionsStyle,
              controller.dragAnimatedStyle,
              style,
            ]}
            //@ts-expect-error
            className={props.className}
          >
            {props.hideBumper ? (
              <></>
            ) : props.dragArea === 'bumper' || !props.dragArea ? (
              <DragGesture
                onDrag={controller.onDragGesture}
                onDragStart={controller.onDragStartGesture}
                onDragEnd={controller.onDragEndGesture}
              >
                {props.BumperComponent ? (
                  <props.BumperComponent />
                ) : (
                  <Bumper {...props} />
                )}
              </DragGesture>
            ) : props.BumperComponent ? (
              <props.BumperComponent />
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
              <BottomSheetContext.Provider
                value={{
                  scrollY: controller.scrollY,
                  onBeginScroll: controller.onBeginScroll,
                  onUpdateScroll: controller.onUpdateScroll,
                  onEndScroll: controller.onEndScroll,
                  scrollableComponentRef: controller.scrollableComponentRef,
                  maxScrollOffset: controller.maxScrollOffset,
                  inverted: controller.inverted,
                }}
              >
                {!props.showContentDelay ? (
                  props.children
                ) : !props.showContentDelay.type ||
                  props.showContentDelay.type === 'opacity' ? (
                  <Animated.View style={[controller.contentOpacityStyle]}>
                    {props.children}
                  </Animated.View>
                ) : (
                  <ComponentMounter
                    component={
                      <Animated.View style={[controller.contentOpacityStyle]}>
                        {props.children}
                      </Animated.View>
                    }
                    mountDelayInMilliSeconds={
                      props.showContentDelay.timeInMilliSecs
                    }
                    showComponent={true}
                    setShowComponent={() => true}
                  />
                )}
              </BottomSheetContext.Provider>
            </Animated.View>
          </Animated.View>
        </DragGesture>
      </ModalForegroundWrapper>
    );
  }
);

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
