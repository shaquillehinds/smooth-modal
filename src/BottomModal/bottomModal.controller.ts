import { useDragAnimation } from '../animations/drag.animation';
import * as Layout from '../utils/Layout.const';
import { type KeyboardEvent, type LayoutChangeEvent } from 'react-native';
import {
  type AnimationCallback,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { wait } from '../utils/wait';

// function workletLog(...args: any[]) {
//   console.log($lf(26), ...args);
// }

const opacityDurationA = 100;
const opacityDurationB = 800;

export function bottomModalController(props: BottomModalAnimatedProps) {
  const [closing, setClosing] = useState(false);
  const [disableLayoutAnimation, setDisableLayoutAnimation] = useState(false);

  const closedYPosition = 0;

  const keyboardHeight = useMemo(() => ({ value: 0 }), []);
  const setKeyboardHeight = useCallback(
    (height: number) => (keyboardHeight.value = height),
    []
  );

  const backdropOpacity = useSharedValue(0);
  const backdropOpacityStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalOpacity = useSharedValue(1);
  const modalOpacityStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }));

  const {
    dragAnimatedStyle,
    onDrag,
    onDragStart,
    translationY,
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

  const onModalContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      // console.log($lf(80), 'content layout', closing, disableLayoutAnimation);
      if (!closing && !disableLayoutAnimation)
        runOnUI(animateModalOpen)(e.nativeEvent.layout.height);
    },
    [closing, disableLayoutAnimation]
  );

  const animateModalOpacity = useCallback(
    (opacity: number, duration: number, callback?: AnimationCallback) => {
      'worklet';
      modalOpacity.value = withTiming(opacity, { duration }, callback);
    },
    []
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

  const adjustForKeyboardHeight = useCallback((height: number) => {
    'worklet';
    translationY.value = withTiming(height, openTimingConfig);
    prevTranslationY.value = height;
  }, []);

  useKeyboardListeners({
    listeners: {
      keyboardDidShow: async (e: KeyboardEvent) => {
        // await wait(50);
        if (!Layout.isAndroid || keyboardHeight.value) return;
        if (
          props.inputsToKeepVisibleWithKeyboard &&
          !props.inputsToKeepVisibleWithKeyboard.find((input) => {
            return input.current?.isFocused();
          })
        )
          return;
        const height = translationY.value + e.endCoordinates.height;
        setKeyboardHeight(e.endCoordinates.height * -1);
        setDisableLayoutAnimation(true);
        // runOnUI(adjustForKeyboardHeight)(height);
        runOnUI(animateModalOpacity)(0, opacityDurationA, () => {
          'worklet';
          adjustForKeyboardHeight(height);
          // translationY.value = height;
          // prevTranslationY.value = height;
          modalOpacity.value = withTiming(1, { duration: opacityDurationB });
        });
      },
      keyboardWillShow: async (e: KeyboardEvent) => {
        await wait(10);
        if (!Layout.isIOS || keyboardHeight.value) return;
        if (
          props.inputsForKeyboardToAvoid &&
          !props.inputsForKeyboardToAvoid.find((input) => {
            return input.current?.isFocused();
          })
        )
          return;
        const height = translationY.value - e.endCoordinates.height;
        setKeyboardHeight(e.endCoordinates.height);
        runOnUI(adjustForKeyboardHeight)(height);
      },
      keyboardWillHide: () => {
        if (!Layout.isIOS || !keyboardHeight.value) return;
        const height = translationY.value + keyboardHeight.value;
        setKeyboardHeight(0);
        runOnUI(adjustForKeyboardHeight)(height);
      },
      keyboardDidHide: async () => {
        // await wait(50);
        if (!keyboardHeight.value || !Layout.isAndroid) return;
        const height = translationY.value + keyboardHeight.value;
        setKeyboardHeight(0);
        setDisableLayoutAnimation(false);
        // runOnUI(adjustForKeyboardHeight)(height);
        runOnUI(animateModalOpacity)(0, opacityDurationA, () => {
          'worklet';
          adjustForKeyboardHeight(height);
          // translationY.value = height;
          // prevTranslationY.value = height;
          modalOpacity.value = withTiming(1, { duration: opacityDurationB });
        });
      },
    },
    subscribeCondition: () =>
      (!!(props.avoidKeyboard || props.inputsForKeyboardToAvoid?.length) &&
        Layout.isIOS) ||
      !!(props.inputsToKeepVisibleWithKeyboard?.length && Layout.isAndroid),
  });

  return {
    onDragGesture,
    onDragStartGesture,
    onDragEndGesture,

    onModalContentLayout,
    onModalBackdropPress,

    dragAnimatedStyle,
    modalOpacityStyle,
    backdropOpacityStyle,
  };
}

// function $lf(n: number) {
//   return '$lf|src/BottomModal/bottomModal.controller.ts:' + n + ' >';
//   // Automatically injected by Log Location Injector vscode extension
// }
