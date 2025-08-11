import { useDragAnimation } from '../../animations/drag.animation';
import {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { strToNumPercentage } from '../../utils/strToNumPercentage';
import { useBottomModalUtils } from './hooks/useBottomModalUtils';

export function bottomModalController(props: BottomSheetModalProps) {
  const utils = useBottomModalUtils();

  const modalState = useRef(ModalState.CLOSED);
  const fullyOpenYPosition = useSharedValue(0);
  const lowestSnapPointPosition = useSharedValue(0);
  const closedYPosition = useSharedValue(0);

  const currentSnapPoint = useSharedValue<SnapPoint>({
    offset: 0,
  });
  const snapPoints = useSharedValue<SnapPoint[]>(
    (props.snapPoints || []).map((p) => utils.percentageToSnapPoint(p))
  );

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
    animateModalOpen,
    animateModalClose,
    animateToPercentage,
    animateToSnapPointIndex,
    onModalBackdropPress,
    onModalContentLayout,
    onPlatformViewLayout,
    onRequestClose,
  } = callbackController({
    utils,
    unMounter: props._unMounter,
    snapPoints,
    modalState,
    translationX,
    translationY,
    onBackDropPress: props.onBackDropPress,
    backdropOpacity,
    closedYPosition,
    prevTranslationY,
    fullyOpenYPosition,
    disableLayoutAnimation,
    setDisableLayoutAnimation,
    disableCloseOnBackdropPress: props.disableCloseOnBackdropPress,
    setShowModal: props.setShowModal,
  });

  const [modalDimensionsStyle, setModalDimensionsStyle] = useState({
    width: utils.screenWidth,
    height: utils.modalHeight,
    bottom: utils.modalBottomOffset,
  });

  useEffect(() => {
    const percentToSnapPoint = (p: string | number) => {
      const percentage = strToNumPercentage(p);
      return {
        percentage: percentage / 100,
        offset: -(utils.relativeY(percentage) + utils.extraHeight),
      };
    };
    const newSnapPoints = (props.snapPoints || []).map((p) =>
      percentToSnapPoint(p)
    );
    snapPoints.value = newSnapPoints;
    setModalDimensionsStyle({
      height: utils.modalHeight,
      bottom: -utils.modalHeight * 2,
      width: utils.relativeX(100),
    });
    if (newSnapPoints.length) {
      const { firstSnapPoint, maxSnapPoint, minSnapPoint } =
        utils.getMaxMinSnapPoints(newSnapPoints);
      currentSnapPoint.value = firstSnapPoint;
      fullyOpenYPosition.value = maxSnapPoint;
      lowestSnapPointPosition.value = minSnapPoint;
      setTimeout(() => {
        if (!modalState.current || modalState.current === ModalState.CLOSING)
          return;
        animateToSnapPointIndex(0);
      }, 500);
    }
  }, [utils.orientation]);

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
      keepMounted: props.keepMounted,
      lowestSnapPointPosition,
      allowDragWhileKeyboardVisible: props.allowDragWhileKeyboardVisible,
    });

  keyboardAnimationController({
    keyboardHeight,
    translationY,
    screenHeight: utils.screenHeight,
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
    const animateContentDelay = () => {
      if (props.showContentDelay) {
        setTimeout(() => {
          contentOpacity.value = withTiming(1, { duration: 500 });
        }, props.showContentDelay.timeInMilliSecs);
      }
    };
    if (props.showModal === undefined) animateContentDelay();
    else if (!props.showModal && !disableLayoutAnimation.current) {
      setDisableLayoutAnimation(true);
      runOnUI(animateModalClose)();
    } else if (props.showModal) animateContentDelay();
  }, [props.showModal]);

  return {
    modalState,

    scrollY,
    inverted,
    onEndScroll,
    onBeginScroll,
    onUpdateScroll,
    maxScrollOffset,
    scrollableComponentRef,

    disableLayoutAnimation,

    animateModalOpen,
    animateModalClose,
    animateToPercentage,
    animateToSnapPointIndex,

    onDragGesture,
    onDragStartGesture,
    onDragEndGesture,

    onPlatformViewLayout,
    onModalContentLayout,

    onRequestClose,
    onModalBackdropPress,

    dragAnimatedStyle,
    modalContentAnimatedStyle,
    backdropOpacityStyle,
    contentOpacityStyle,
    modalDimensionsStyle,

    screenHeight: utils.screenHeight,
  };
}

export type BottomModalControllerReturn = ReturnType<
  typeof bottomModalController
>;
