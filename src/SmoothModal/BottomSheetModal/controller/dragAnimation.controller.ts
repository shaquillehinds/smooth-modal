//$lf-ignore
import {
  runOnJS,
  withTiming,
  type WithTimingConfig,
  type SharedValue,
} from 'react-native-reanimated';
import { type DragGestureProps } from '../../gestures/Drag.gesture';
import { useCallback } from 'react';
import {
  halfCloseTimingConfig,
  velocityCloseTimingConfig,
} from '../config/bottomSheetModal.constants';
import { type OnMoveAnimationProps } from '../../animations/drag.animation';

type DragAnimationControllerProps = {
  keyboardHeight: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  fullyOpenYPosition: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  allowDragWhileKeyboardVisible?: boolean;
  closedYPosition: number;
  onDrag: (props: OnMoveAnimationProps) => void;
  onDragStart: () => void;
  closeModal: (delayMS?: number) => void;
};

export function dragAnimationController(props: DragAnimationControllerProps) {
  const {
    allowDragWhileKeyboardVisible,
    keyboardHeight,
    backdropOpacity,
    closeModal,
    closedYPosition,
    onDrag,
    onDragStart,
    translationY,
    prevTranslationY,
    fullyOpenYPosition,
  } = props;
  // Gesture event handlers
  const onDragStartGesture: DragGestureProps['onDragStart'] =
    useCallback(() => {
      'worklet';
      if (keyboardHeight.value && !allowDragWhileKeyboardVisible) return;
      onDragStart();
    }, []);
  const onDragGesture: DragGestureProps['onDrag'] = useCallback((e) => {
    'worklet';
    if (keyboardHeight.value && !allowDragWhileKeyboardVisible) return;
    onDrag({
      posX: 0,
      posY: e.translationY,
      minPosY: fullyOpenYPosition.value,
      maxPosY: closedYPosition,
    });
    backdropOpacity.value = 1 - e.translationY / -fullyOpenYPosition.value;
  }, []);

  const onDragEndGesture: NonNullable<DragGestureProps['onDragEnd']> =
    useCallback((e) => {
      'worklet';
      if (keyboardHeight.value && !allowDragWhileKeyboardVisible) return;
      const halfContentHeight = -(fullyOpenYPosition.value / 2);
      const isClosed = prevTranslationY.value === closedYPosition;
      const isMovedPastHalf = Math.abs(e.translationY) > halfContentHeight;
      const isHighVelocity = isClosed
        ? e.velocityY < -1000
        : e.velocityY > 1000;
      //prettier-ignore
      const animate = (to: number, timing: WithTimingConfig, opacity: number) => {
        translationY.value = withTiming(to, timing);
        backdropOpacity.value = withTiming(opacity, velocityCloseTimingConfig);
      };
      if (isClosed) {
        if (e.translationY > 50 || isMovedPastHalf)
          animate(fullyOpenYPosition.value, halfCloseTimingConfig, 1);
        else if (isHighVelocity)
          animate(fullyOpenYPosition.value, velocityCloseTimingConfig, 1);
        else animate(closedYPosition, halfCloseTimingConfig, 0);
        return;
      }
      if (isMovedPastHalf || isHighVelocity) {
        if (e.velocityY > 1000)
          animate(closedYPosition, velocityCloseTimingConfig, 0);
        else animate(closedYPosition, halfCloseTimingConfig, 0);
        runOnJS(closeModal)(175);
      } else if (e.translationY <= halfContentHeight) {
        animate(fullyOpenYPosition.value, halfCloseTimingConfig, 1);
      }
    }, []);

  return { onDragGesture, onDragEndGesture, onDragStartGesture };
}
