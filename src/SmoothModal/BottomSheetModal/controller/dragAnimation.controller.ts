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
import type { SnapPoint } from '../config/bottomSheetModal.types';

type DragAnimationControllerProps = {
  snapPoints: SharedValue<SnapPoint[]>;
  currentSnapPoint: SharedValue<SnapPoint>;
  keyboardHeight: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  fullyOpenYPosition: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  allowDragWhileKeyboardVisible?: boolean;
  closedYPosition: SharedValue<number>;
  onDrag: (props: OnMoveAnimationProps) => void;
  onDragStart: () => void;
  closeModal: (delayMS?: number) => void;
};

export function dragAnimationController(props: DragAnimationControllerProps) {
  const {
    snapPoints,
    currentSnapPoint,
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
      maxPosY: closedYPosition.value,
      minMaxBehavior: 'stretch',
    });
    if (snapPoints.value.length)
      backdropOpacity.value =
        -(currentSnapPoint.value.offset + e.translationY) /
        -fullyOpenYPosition.value;
    else {
      if (prevTranslationY.value === fullyOpenYPosition.value)
        backdropOpacity.value =
          -(e.translationY + fullyOpenYPosition.value) /
          -fullyOpenYPosition.value;
      else if (e.translationY < 0)
        backdropOpacity.value = e.translationY / -fullyOpenYPosition.value;
    }
  }, []);

  const onDragEndGesture: NonNullable<DragGestureProps['onDragEnd']> =
    useCallback((e) => {
      'worklet';
      if (keyboardHeight.value && !allowDragWhileKeyboardVisible) return;
      //prettier-ignore
      const animate = (to: number, timing: WithTimingConfig, opacity: number) => {
            translationY.value = withTiming(to, timing);
            backdropOpacity.value = withTiming(opacity, velocityCloseTimingConfig);
          };
      if (snapPoints.value.length) {
        if (e.velocityY > 1000) {
          animate(closedYPosition.value, velocityCloseTimingConfig, 0);
          currentSnapPoint.value = {
            offset: closedYPosition.value,
          };
          return runOnJS(closeModal)(175);
        }
        if (snapPoints.value.length === 1)
          return animate(
            snapPoints.value[0]?.offset!,
            halfCloseTimingConfig,
            1
          );
        let closestSnapPointValue: number | undefined;
        let closestSnapPointOffset: number | undefined;
        for (let i = 0; i < snapPoints.value.length; i++) {
          const snapPoint = snapPoints.value[i];
          if (!snapPoint)
            return animate(fullyOpenYPosition.value, halfCloseTimingConfig, 1);
          if (closestSnapPointValue === undefined) {
            closestSnapPointValue = Math.abs(
              currentSnapPoint.value.offset + e.translationY - snapPoint.offset
            );
            closestSnapPointOffset = snapPoint.offset;
            continue;
          }
          const currSnapPointValue = Math.abs(
            currentSnapPoint.value.offset + e.translationY - snapPoint.offset
          );
          if (currSnapPointValue < closestSnapPointValue) {
            closestSnapPointValue = currSnapPointValue;
            closestSnapPointOffset = snapPoint.offset;
          }
        }
        if (closestSnapPointOffset) {
          currentSnapPoint.value = {
            offset: closestSnapPointOffset,
          };
          return animate(
            closestSnapPointOffset,
            halfCloseTimingConfig,
            closestSnapPointOffset / fullyOpenYPosition.value
          );
        }
        return animate(fullyOpenYPosition.value, halfCloseTimingConfig, 1);
      }
      const halfContentHeight = -(fullyOpenYPosition.value / 2);
      const isClosed = prevTranslationY.value === closedYPosition.value;
      const isMovedPastHalf = Math.abs(e.translationY) > halfContentHeight;
      const isHighVelocity = isClosed
        ? e.velocityY < -1000
        : e.velocityY > 1000;
      if (isClosed) {
        if (e.translationY > 50 || isMovedPastHalf)
          animate(fullyOpenYPosition.value, halfCloseTimingConfig, 1);
        else if (isHighVelocity)
          animate(fullyOpenYPosition.value, velocityCloseTimingConfig, 1);
        else animate(closedYPosition.value, halfCloseTimingConfig, 0);
        return;
      }
      if (isMovedPastHalf || isHighVelocity) {
        if (e.velocityY > 1000)
          animate(closedYPosition.value, velocityCloseTimingConfig, 0);
        else animate(closedYPosition.value, halfCloseTimingConfig, 0);
        runOnJS(closeModal)(175);
      } else if (e.translationY <= halfContentHeight) {
        animate(fullyOpenYPosition.value, halfCloseTimingConfig, 1);
      }
    }, []);

  return { onDragGesture, onDragEndGesture, onDragStartGesture };
}
