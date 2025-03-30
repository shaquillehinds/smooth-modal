import { runOnJS, withTiming, type SharedValue } from 'react-native-reanimated';
import { type DragGestureProps } from '../../gestures/Drag.gesture';
import { useCallback } from 'react';
import {
  halfCloseTimingConfig,
  velocityCloseTimingConfig,
} from '../bottomSheetModal.constants';
import { type OnMoveAnimationProps } from '../../animations/drag.animation';

type DragAnimationControllerProps = {
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  onDrag: (props: OnMoveAnimationProps) => void;
  onDragStart: () => void;
  closedYPosition: number;
  closeModal: (delayMS?: number) => void;
};

export function dragAnimationController(props: DragAnimationControllerProps) {
  const {
    backdropOpacity,
    closeModal,
    closedYPosition,
    onDrag,
    onDragStart,
    prevTranslationY,
    translationY,
  } = props;
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
        runOnJS(closeModal)(175);
      } else {
        translationY.value = withTiming(
          prevTranslationY.value,
          halfCloseTimingConfig
        );
        backdropOpacity.value = withTiming(1, halfCloseTimingConfig);
      }
    }, []);

  return { onDragGesture, onDragEndGesture, onDragStartGesture };
}
