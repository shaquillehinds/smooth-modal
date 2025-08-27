//$lf-ignore
import {
  runOnJS,
  withTiming,
  type WithTimingConfig,
  type SharedValue,
} from 'react-native-reanimated';
import { type DragGestureProps } from '../../gestures/Drag.gesture';
import { useCallback } from 'react';
import { modalTransitionTimingConfig } from '../config/bottomSheetModal.constants';
import { type OnMoveAnimationProps } from '../../animations/drag.animation';
import type { SnapPoint } from '../config/bottomSheetModal.types';

type DragAnimationControllerProps = {
  snapPoints: SharedValue<SnapPoint[]>;
  currentSnapPoint: SharedValue<SnapPoint>;
  keyboardHeight: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  fullyOpenYPosition: SharedValue<number>;
  lowestSnapPointPosition: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  closedYPosition: SharedValue<number>;

  keepMounted?: boolean;
  allowDragWhileKeyboardVisible?: boolean;

  onDrag: (props: OnMoveAnimationProps) => void;
  onDragStart: () => void;
  closeModal: (delayMS?: number) => void;
  onSnapPointReach?: (snapPointIndex: number) => Promise<void> | void;
};

export function dragAnimationController(props: DragAnimationControllerProps) {
  const {
    snapPoints,
    currentSnapPoint,
    allowDragWhileKeyboardVisible,
    keyboardHeight,
    backdropOpacity,
    closeModal,
    keepMounted,
    closedYPosition,
    onSnapPointReach,
    onDragStart,
    lowestSnapPointPosition,
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
    const val = prevTranslationY.value + e.translationY;
    const stretch = 100;
    translationY.value =
      val >= fullyOpenYPosition.value
        ? val
        : fullyOpenYPosition.value -
          stretch +
          stretch / ((fullyOpenYPosition.value - val) / stretch + 1);
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
      const animate = (
        to: number,
        timing: WithTimingConfig,
        opacity: number,
        index?: number
      ) => {
        translationY.value = withTiming(to, timing, () => {
          typeof index === 'number' &&
            onSnapPointReach &&
            runOnJS(onSnapPointReach)(index);
        });
        backdropOpacity.value = withTiming(
          opacity,
          modalTransitionTimingConfig
        );
      };
      if (snapPoints.value.length) {
        const fullyOpenIndex = snapPoints.value.length - 1;
        if (e.velocityY > 1500) {
          if (
            currentSnapPoint.value.offset === lowestSnapPointPosition.value &&
            !keepMounted
          ) {
            animate(closedYPosition.value, modalTransitionTimingConfig, 0);
            return runOnJS(closeModal)(175);
          }
          if (e.velocityY > 3500 && !keepMounted) {
            animate(closedYPosition.value, modalTransitionTimingConfig, 0);
            return runOnJS(closeModal)(175);
          }
          if (e.velocityY > 1500) {
            animate(
              lowestSnapPointPosition.value,
              modalTransitionTimingConfig,
              lowestSnapPointPosition.value / fullyOpenYPosition.value,
              0
            );
            currentSnapPoint.value = {
              offset: lowestSnapPointPosition.value,
            };
            return;
          }
        } else if (e.velocityY < -1500) {
          animate(
            fullyOpenYPosition.value,
            modalTransitionTimingConfig,
            1,
            fullyOpenIndex
          );
          currentSnapPoint.value = {
            offset: fullyOpenYPosition.value,
          };
          return;
        }
        let closestSnapPointValue = Math.abs(
          currentSnapPoint.value.offset + e.translationY + 100
        );
        let closestSnapPointOffset = 0;
        let closestSnapPointIndex = 0;
        for (let i = 0; i < snapPoints.value.length; i++) {
          const snapPoint = snapPoints.value[i];
          if (!snapPoint)
            return animate(
              fullyOpenYPosition.value,
              modalTransitionTimingConfig,
              1,
              fullyOpenIndex
            );
          const currSnapPointValue = Math.abs(
            currentSnapPoint.value.offset + e.translationY - snapPoint.offset
          );
          if (currSnapPointValue < closestSnapPointValue) {
            closestSnapPointValue = currSnapPointValue;
            closestSnapPointOffset = snapPoint.offset;
            closestSnapPointIndex = i;
          }
        }
        if (closestSnapPointOffset) {
          currentSnapPoint.value = {
            offset: closestSnapPointOffset,
          };
          return animate(
            closestSnapPointOffset,
            modalTransitionTimingConfig,
            closestSnapPointOffset / fullyOpenYPosition.value,
            closestSnapPointIndex
          );
        }
        if (!keepMounted) {
          runOnJS(closeModal)(175);
          return animate(closedYPosition.value, modalTransitionTimingConfig, 0);
        } else
          return animate(
            lowestSnapPointPosition.value,
            modalTransitionTimingConfig,
            lowestSnapPointPosition.value / fullyOpenYPosition.value,
            0
          );
      }
      const halfContentHeight = -(fullyOpenYPosition.value / 2);
      const isClosed = prevTranslationY.value === closedYPosition.value;
      const isMovedPastHalf = Math.abs(e.translationY) > halfContentHeight;
      const isHighVelocity = isClosed
        ? e.velocityY < -1000
        : e.velocityY > 1000;
      if (isClosed) {
        if (e.translationY > 50 || isMovedPastHalf)
          animate(fullyOpenYPosition.value, modalTransitionTimingConfig, 1);
        else if (isHighVelocity)
          animate(fullyOpenYPosition.value, modalTransitionTimingConfig, 1);
        else animate(closedYPosition.value, modalTransitionTimingConfig, 0);
        return;
      }
      if (isMovedPastHalf || isHighVelocity) {
        if (e.velocityY > 1000)
          animate(closedYPosition.value, modalTransitionTimingConfig, 0);
        else animate(closedYPosition.value, modalTransitionTimingConfig, 0);
        runOnJS(closeModal)(175);
      } else if (e.translationY <= halfContentHeight) {
        animate(fullyOpenYPosition.value, modalTransitionTimingConfig, 1);
      }
    }, []);

  return { onDragGesture, onDragEndGesture, onDragStartGesture };
}
