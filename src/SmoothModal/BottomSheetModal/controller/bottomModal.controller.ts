import { useDragAnimation } from '../../animations/drag.animation';
import {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCallback, useEffect, useRef } from 'react';
import {
  ModalState,
  type BottomSheetModalProps,
  type ScrollComponentRefProps,
  type SnapPoint,
} from '../config/bottomSheetModal.types';
import { keyboardAnimationController } from './keyboardAnimation.controller';
import { dragAnimationController } from './dragAnimation.controller';
import { callbackController } from './callbacks.controller';
import { scrollContentController } from './scrollContent.controller';
import { extraHeight } from '../config/bottomSheetModal.constants';
import { relativeY } from '../../utils/Layout.const';
import { strToNumPercentage } from '../../utils/strToNumPercentage';
import { getMaxMinSnapPoints } from '../config/bottomSheetModal.utils';

export function bottomModalController(props: BottomSheetModalProps) {
  const modalState = useRef(ModalState.CLOSED);
  const fullyOpenYPosition = useSharedValue(0);
  const closedYPosition = useSharedValue(0);

  const currentSnapPoint = useSharedValue<SnapPoint>({
    offset: 0,
  });
  const snapPoints = useSharedValue<SnapPoint[]>(
    (props.snapPoints || []).map((p) => {
      const percentage = strToNumPercentage(p);
      return {
        percentage: percentage / 100,
        offset: -(relativeY(percentage) + extraHeight),
      };
    })
  );

  useEffect(() => {
    if (snapPoints.value.length) {
      const { firstSnapPoint, maxSnapPoint, minSnapPoint } =
        getMaxMinSnapPoints(snapPoints);
      currentSnapPoint.value = firstSnapPoint;
      fullyOpenYPosition.value = maxSnapPoint;
      closedYPosition.value = props.keepMounted ? minSnapPoint : 0;
    }
  }, []);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const keyboardHeight = useSharedValue(0);

  const backdropOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const modalContentTranslateY = useSharedValue(0);

  const scrollY = useSharedValue(0);
  const scrollActive = useSharedValue(false);
  const inverted = useSharedValue(false);
  const maxScrollOffset = useSharedValue(0);

  const scrollableComponentRef = useRef<ScrollComponentRefProps>(null);

  const disableLayoutAnimation = useRef(false);
  const setDisableLayoutAnimation = useCallback((bool: boolean) => {
    disableLayoutAnimation.current = bool;
  }, []);

  const backdropOpacityStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  const contentOpacityStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
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
    snapPoints,
    modalState,
    translationX,
    translationY,
    backdropOpacity,
    closedYPosition,
    prevTranslationY,
    fullyOpenYPosition,
    disableLayoutAnimation,
    setDisableLayoutAnimation,
    setShowModal: props.setShowModal,
  });

  const { onDragEndGesture, onDragGesture, onDragStartGesture } =
    dragAnimationController({
      onDrag,
      onDragStart,
      closeModal,
      snapPoints,
      currentSnapPoint,
      keyboardHeight,
      translationY,
      prevTranslationY,
      closedYPosition,
      fullyOpenYPosition,
      backdropOpacity,
      allowDragWhileKeyboardVisible: props.allowDragWhileKeyboardVisible,
    });

  keyboardAnimationController({
    keyboardHeight,
    translationY,
    prevTranslationY,
    modalContentTranslateY,
    setDisableLayoutAnimation,
    avoidKeyboard: props.avoidKeyboard,
    inputsForKeyboardToAvoid: props.inputsForKeyboardToAvoid,
  });

  const { onBeginScroll, onUpdateScroll, onEndScroll } =
    scrollContentController({
      scrollableComponentRef,
      onDragStartGesture,
      onDragGesture,
      onDragEndGesture,
      maxScrollOffset,
      scrollActive,
      inverted,
      scrollY,
    });

  useEffect(() => {
    if (!props.showModal && !disableLayoutAnimation.current) {
      setDisableLayoutAnimation(true);
      runOnUI(animateModalClose)();
    } else if (props.showModal) {
      if (props.showContentDelay) {
        setTimeout(() => {
          contentOpacity.value = withTiming(1, { duration: 500 });
        }, props.showContentDelay.timeInMilliSecs);
      }
    }
  }, [props.showModal]);

  return {
    scrollY,
    onBeginScroll,
    onUpdateScroll,
    onEndScroll,
    scrollableComponentRef,
    maxScrollOffset,
    inverted,

    onDragGesture,
    onDragStartGesture,
    onDragEndGesture,

    onPlatformViewLayout,

    onModalContentLayout,
    onModalBackdropPress,

    dragAnimatedStyle,
    modalContentAnimatedStyle,
    backdropOpacityStyle,
    contentOpacityStyle,
  };
}

export type BottomModalControllerReturn = ReturnType<
  typeof bottomModalController
>;
