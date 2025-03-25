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
  halfCloseTimingConfig,
  modalContentMaxHeight,
  openTimingConfig,
  velocityCloseTimingConfig,
  yOffset,
} from './bottomModal.constants';
import { type DragGestureProps } from '..//gestures/Drag.gesture';
import { type BottomModalAnimatedProps } from './bottomModal.types';
import { useKeyboardListeners } from '../hooks/useKeyboardListeners';
import { useCallback, useEffect, useRef, useState } from 'react';
import { wait } from '../utils/wait';

// function workletLog(...args: any[]) {
//   console.log($lf(25), ...args);
// }

export function bottomModalController(props: BottomModalAnimatedProps) {
  const disableSafeArea = props.disableSafeArea;

  const [closing, setClosing] = useState(false);
  const [disableLayoutAnimation, setDisableLayoutAnimation] = useState(false);

  const closedYPosition = 0;

  const keyboardModalShift = useRef(0);
  const setKeyboardModalShift = useCallback((height: number) => {
    keyboardModalShift.current = height;
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

  const onPlatformViewLayout = useCallback(
    (e: LayoutChangeEvent) => {
      translationX.value = -e.nativeEvent.layout.x;
    },
    [closing, disableLayoutAnimation]
  );

  const onModalContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (!closing && !disableLayoutAnimation)
        runOnUI(animateModalOpen)(e.nativeEvent.layout.height);
    },
    [closing, disableLayoutAnimation]
  );

  const closeModal = useCallback(() => {
    props.setShowModal(false);
    setClosing(true);
  }, []);

  useEffect(() => {
    if (!props.showModal && !closing) {
      setClosing(true);
      runOnUI(animateModalClose)();
    }
  }, [props.showModal, closing]);

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
          runOnJS(closeModal)();
        } else {
          translationY.value = withTiming(
            closedYPosition,
            halfCloseTimingConfig
          );
          backdropOpacity.value = withTiming(0, halfCloseTimingConfig);
          runOnJS(closeModal)();
        }
      } else {
        translationY.value = withTiming(
          prevTranslationY.value,
          halfCloseTimingConfig
        );
        backdropOpacity.value = withTiming(1, halfCloseTimingConfig);
      }
    }, []);

  const adjustForKeyboardHeight = useCallback(
    (height: number, newKeyboardHeight: number) => {
      'worklet';
      const maxModalY = Layout.SCREEN_HEIGHT * -1;
      if (newKeyboardHeight > 10) {
        if (translationY.value <= maxModalY) {
          modalContentTranslateY.value = withTiming(height, openTimingConfig);
        } else {
          const maxGap = maxModalY - translationY.value;
          if (height < maxModalY) {
            const modalShift = translationY.value + maxGap;
            runOnJS(setKeyboardModalShift)(maxGap);
            translationY.value = withTiming(modalShift, openTimingConfig);
            prevTranslationY.value = modalShift;
            modalContentTranslateY.value = withTiming(
              -newKeyboardHeight - maxGap,
              openTimingConfig
            );
          } else {
            translationY.value = withTiming(height, openTimingConfig);
            prevTranslationY.value = height;
          }
        }
      } else {
        translationY.value = withTiming(height, openTimingConfig);
        prevTranslationY.value = height;
        modalContentTranslateY.value = withTiming(0, openTimingConfig);
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
    const height = translationY.value - e.endCoordinates.height;
    setKeyboardHeight(e.endCoordinates.height);
    setDisableLayoutAnimation(true);
    runOnUI(adjustForKeyboardHeight)(height, keyboardHeight.current);
  }, []);

  const keyboardHideListener = useCallback(async () => {
    if (!keyboardHeight.current) return;
    const height = keyboardModalShift.current
      ? translationY.value - keyboardModalShift.current
      : translationY.value + keyboardHeight.current;
    setKeyboardHeight(0);
    setKeyboardModalShift(0);
    setDisableLayoutAnimation(false);
    runOnUI(adjustForKeyboardHeight)(height, keyboardHeight.current);
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
        Layout.isAndroid && !disableSafeArea && keyBoardShowListener(e);
      },
      keyboardDidHide: async () => {
        Layout.isAndroid && !disableSafeArea && keyboardHideListener();
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
