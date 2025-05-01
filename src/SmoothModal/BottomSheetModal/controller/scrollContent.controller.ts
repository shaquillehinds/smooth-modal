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

  const onBeginScroll: DragGestureProps['onDragStart'] = useCallback((e) => {
    'worklet';
    const isScrollingDown = inverted.value
      ? scrollY.value < maxScrollOffset.value - 15
      : scrollY.value > 15;
    if (isScrollingDown) {
      scrollActive.value = true;
    } else onDragStartGesture(e);
  }, []);
  const onUpdateScroll: DragGestureProps['onDrag'] = useCallback(
    (e) => {
      'worklet';
      if (scrollActive.value) return;
      if (!e.translationY) return;
      if (
        e.translationY > 0 &&
        (inverted.value
          ? scrollY.value >= maxScrollOffset.value - 15
          : scrollY.value <= 15)
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
