import { useDragAnimation } from '../animations/drag.animation';
import * as Layout from '../utils/Layout.const';
import { type KeyboardEvent, type LayoutChangeEvent } from 'react-native';
import {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  closeKeyboardTimingConfig,
  halfCloseTimingConfig,
  modalContentMaxHeight,
  openKeyboardTimingConfig,
  openTimingConfig,
  velocityCloseTimingConfig,
  yOffset,
} from './bottomModal.constants';
import { type DragGestureProps } from '..//gestures/Drag.gesture';
import { type BottomModalAnimatedProps } from './bottomModal.types';
import { useKeyboardListeners } from '../hooks/useKeyboardListeners';
import { useCallback, useEffect, useRef } from 'react';
import { wait } from '../utils/wait';

// function workletLog(...args: any[]) {
//   console.log($lf(27), ...args);
// }

export function bottomModalController(props: BottomModalAnimatedProps) {
  const closedYPosition = 0;

  const disableLayoutAnimation = useRef(false);
  const setDisableLayoutAnimation = useCallback((bool: boolean) => {
    disableLayoutAnimation.current = bool;
  }, []);

  const keyboardHeight = useRef(0);
  const setKeyboardHeight = useCallback((height: number) => {
    keyboardHeight.current = height;
  }, []);

  const backdropOpacity = useSharedValue(0);
  const backdropOpacityStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalContentTranslateY = useSharedValue(0);
  const modalContentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalContentTranslateY.value }],
  }));

  const {
    dragAnimatedStyle,
    onDrag,
    onDragStart,
    translationY,
    translationX,
    prevTranslationY,
  } = useDragAnimation();

  const animateModalOpen = useCallback((height: number) => {
    'worklet';
    if (height > modalContentMaxHeight) height = modalContentMaxHeight;
    const translateYHeight = -height - yOffset;
    translationY.value = withTiming(translateYHeight, openTimingConfig, () => {
      prevTranslationY.value = translateYHeight;
    });
    backdropOpacity.value = withTiming(1, openTimingConfig);
  }, []);

  const animateModalClose = useCallback(() => {
    'worklet';
    translationY.value = withTiming(closedYPosition, halfCloseTimingConfig);
    backdropOpacity.value = withTiming(0, halfCloseTimingConfig);
  }, []);

  const onPlatformViewLayout = useCallback((e: LayoutChangeEvent) => {
    translationX.value = -e.nativeEvent.layout.x;
  }, []);

  const onModalContentLayout = useCallback((e: LayoutChangeEvent) => {
    if (!disableLayoutAnimation.current)
      runOnUI(animateModalOpen)(e.nativeEvent.layout.height);
  }, []);

  const closeModal = useCallback((delayMS?: number) => {
    delayMS
      ? setTimeout(() => props.setShowModal(false), delayMS)
      : props.setShowModal(false);
    setDisableLayoutAnimation(true);
  }, []);

  useEffect(() => {
    if (!props.showModal && !disableLayoutAnimation.current) {
      setDisableLayoutAnimation(true);
      runOnUI(animateModalClose)();
    }
  }, [props.showModal]);

  const onModalBackdropPress = useCallback(() => {
    closeModal();
    runOnUI(animateModalClose)();
  }, []);

  // Gesture event handlers
  const onDragStartGesture: DragGestureProps['onDragStart'] =
    useCallback(() => {
      'worklet';
      onDragStart();
    }, []);
  const onDragGesture: DragGestureProps['onDrag'] = useCallback((e) => {
    'worklet';
    onDrag({
      posX: 0,
      posY: e.translationY,
      minPosY: prevTranslationY.value,
      maxPosY: closedYPosition,
    });
    backdropOpacity.value = 1 - e.translationY / -prevTranslationY.value;
  }, []);

  const onDragEndGesture: NonNullable<DragGestureProps['onDragEnd']> =
    useCallback((e) => {
      'worklet';
      const halfContentHeight = -(prevTranslationY.value / 2);
      if (e.translationY > halfContentHeight || e.velocityY > 1000) {
        if (e.velocityY > 1000) {
          translationY.value = withTiming(
            closedYPosition,
            velocityCloseTimingConfig
          );
          backdropOpacity.value = withTiming(0, velocityCloseTimingConfig);
        } else {
          translationY.value = withTiming(
            closedYPosition,
            halfCloseTimingConfig
          );
          backdropOpacity.value = withTiming(0, halfCloseTimingConfig);
        }
        runOnJS(closeModal)(50);
      } else {
        translationY.value = withTiming(
          prevTranslationY.value,
          halfCloseTimingConfig
        );
        backdropOpacity.value = withTiming(1, halfCloseTimingConfig);
      }
    }, []);

  const adjustForKeyboardHeight = useCallback(
    (currentKeyboardHeight: number, previousKeyboardHeight: number) => {
      'worklet';
      const maxModalY = Layout.SCREEN_HEIGHT * -1;
      if (currentKeyboardHeight > 10) {
        if (translationY.value <= maxModalY) {
          modalContentTranslateY.value = withTiming(
            -currentKeyboardHeight,
            openKeyboardTimingConfig
          );
        } else {
          const maxGap = maxModalY - translationY.value;
          const height = translationY.value - currentKeyboardHeight;
          if (height < maxModalY) {
            const modalShift = translationY.value + maxGap;
            translationY.value = withTiming(
              modalShift,
              openKeyboardTimingConfig
            );
            prevTranslationY.value = modalShift;
            modalContentTranslateY.value = withTiming(
              -currentKeyboardHeight - maxGap,
              openKeyboardTimingConfig
            );
          } else {
            translationY.value = withTiming(height, openKeyboardTimingConfig);
            prevTranslationY.value = height;
          }
        }
      } else {
        const newTranslationY =
          translationY.value +
          (previousKeyboardHeight + modalContentTranslateY.value);
        translationY.value = withTiming(
          newTranslationY,
          closeKeyboardTimingConfig
        );
        prevTranslationY.value = newTranslationY;
        modalContentTranslateY.value = withTiming(0, closeKeyboardTimingConfig);
      }
    },
    []
  );

  const keyBoardShowListener = useCallback(async (e: KeyboardEvent) => {
    await wait(10);
    if (keyboardHeight.current) return;
    if (
      props.inputsForKeyboardToAvoid &&
      !props.inputsForKeyboardToAvoid.find((input) => {
        return input.current?.isFocused();
      })
    )
      return;
    setKeyboardHeight(e.endCoordinates.height);
    setDisableLayoutAnimation(true);
    runOnUI(adjustForKeyboardHeight)(keyboardHeight.current, 0);
  }, []);

  const keyboardHideListener = useCallback(async () => {
    if (!keyboardHeight.current) return;
    const previousKeyboardHeight = keyboardHeight.current;
    setKeyboardHeight(0);
    setDisableLayoutAnimation(false);
    runOnUI(adjustForKeyboardHeight)(
      keyboardHeight.current,
      previousKeyboardHeight
    );
  }, []);

  useKeyboardListeners({
    listeners: {
      keyboardWillShow: (e) => {
        Layout.isIOS && keyBoardShowListener(e);
      },
      keyboardWillHide: () => {
        Layout.isIOS && keyboardHideListener();
      },
      keyboardDidShow: (e) => {
        Layout.isAndroid && keyBoardShowListener(e);
      },
      keyboardDidHide: async () => {
        Layout.isAndroid && keyboardHideListener();
      },
    },
    subscribeCondition: () =>
      !!(props.avoidKeyboard || props.inputsForKeyboardToAvoid?.length),
  });

  return {
    onDragGesture,
    onDragStartGesture,
    onDragEndGesture,

    onPlatformViewLayout,

    onModalContentLayout,
    onModalBackdropPress,

    dragAnimatedStyle,
    modalContentAnimatedStyle,
    backdropOpacityStyle,
  };
}

export type BottomModalControllerReturn = ReturnType<
  typeof bottomModalController
>;

// function $lf(n: number) {
//   return '$lf|src/BottomModal/bottomModal.controller.ts:' + n + ' >';
//   // Automatically injected by Log Location Injector vscode extension
// }
