//$lf-ignore
import {
  runOnJS,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { DragGestureProps } from '../../gestures/Drag.gesture';
import type { ScrollComponentRef } from '../config/bottomSheetModal.types';
import { useCallback } from 'react';

type ScrollContentControllerType = {
  scrollY: SharedValue<number>;
  maxScrollOffset: SharedValue<number>;
  inverted: SharedValue<boolean>;
  scrollActive: SharedValue<boolean>;
  onDragStartGesture: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onDragEndGesture: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onDragGesture: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  scrollableComponentRef?: ScrollComponentRef;
};

export function scrollContentController({
  scrollActive,
  scrollY,
  onDragStartGesture,
  onDragEndGesture,
  onDragGesture,
  maxScrollOffset,
  inverted,
  scrollableComponentRef,
}: ScrollContentControllerType) {
  const enableScroll = (scrollEnabled: boolean) => {
    scrollableComponentRef?.current?.setNativeProps({ scrollEnabled });
  };
  const scrollEnabled = useSharedValue(true);
  const canInitialize = useSharedValue(false);
  const initialPosition = useSharedValue(0);

  const onBeginScroll: DragGestureProps['onDragStart'] = useCallback((e) => {
    'worklet';
    const minPositionFromTopToEnableScroll = 15;
    const isPositionFarFromTop = inverted.value
      ? scrollY.value < maxScrollOffset.value - minPositionFromTopToEnableScroll
      : scrollY.value > minPositionFromTopToEnableScroll;

    if (isPositionFarFromTop) {
      scrollActive.value = true;
    } else {
      canInitialize.value = true;
      onDragStartGesture(e);
    }
  }, []);
  const onUpdateScroll: DragGestureProps['onDrag'] = useCallback(
    (e) => {
      'worklet';
      if (scrollActive.value) return;
      if (!e.translationY) return;
      if (canInitialize.value) {
        initialPosition.value = scrollY.value;
        canInitialize.value = false;
        return;
      }
      if (
        e.translationY > -400 &&
        (inverted.value
          ? scrollY.value >= initialPosition.value
          : scrollY.value <= initialPosition.value)
      ) {
        if (scrollEnabled.value) {
          runOnJS(enableScroll)(false);
          scrollEnabled.value = false;
        }
        onDragGesture(e);
      } else if (scrollY.value > 0) {
        scrollActive.value = true;
      }
    },
    [enableScroll]
  );
  const onEndScroll: NonNullable<DragGestureProps['onDragEnd']> = useCallback(
    (e) => {
      'worklet';
      if (!scrollActive.value) onDragEndGesture(e);
      scrollActive.value = false;
      runOnJS(enableScroll)(true);
      scrollEnabled.value = true;
    },
    [enableScroll]
  );

  return { onBeginScroll, onUpdateScroll, onEndScroll };
}
