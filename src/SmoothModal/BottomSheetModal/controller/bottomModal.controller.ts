import { useDragAnimation } from '../../animations/drag.animation';
import {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useCallback, useEffect, useRef } from 'react';
import { type BottomSheetModalProps } from '../bottomSheetModal.types';
import { keyboardAnimationController } from './keyboardAnimation.controller';
import { dragAnimationController } from './dragAnimationController';
import { callbackController } from './callbacks.controller';

// function workletLog(...args: any[]) {
//   console.log($lf(14), ...args);
// }

export function bottomModalController(props: BottomSheetModalProps) {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const closedYPosition = 0;

  const backdropOpacity = useSharedValue(0);
  const modalContentTranslateY = useSharedValue(0);

  const disableLayoutAnimation = useRef(false);
  const setDisableLayoutAnimation = useCallback((bool: boolean) => {
    disableLayoutAnimation.current = bool;
  }, []);

  const backdropOpacityStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  const modalContentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalContentTranslateY.value }],
  }));
  const { dragAnimatedStyle, onDrag, onDragStart } = useDragAnimation({
    translationX,
    translationY,
    prevTranslationY,
  });

  const {
    closeModal,
    animateModalClose,
    onModalBackdropPress,
    onModalContentLayout,
    onPlatformViewLayout,
  } = callbackController({
    translationX,
    translationY,
    backdropOpacity,
    closedYPosition,
    prevTranslationY,
    disableLayoutAnimation,
    setDisableLayoutAnimation,
    setShowModal: props.setShowModal,
  });

  const { onDragEndGesture, onDragGesture, onDragStartGesture } =
    dragAnimationController({
      onDrag,
      onDragStart,
      closeModal,
      translationY,
      closedYPosition,
      prevTranslationY,
      backdropOpacity,
    });

  keyboardAnimationController({
    translationY,
    prevTranslationY,
    modalContentTranslateY,
    setDisableLayoutAnimation,
    avoidKeyboard: props.avoidKeyboard,
    inputsForKeyboardToAvoid: props.inputsForKeyboardToAvoid,
  });

  useEffect(() => {
    if (!props.showModal && !disableLayoutAnimation.current) {
      setDisableLayoutAnimation(true);
      runOnUI(animateModalClose)();
    }
  }, [props.showModal]);

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
