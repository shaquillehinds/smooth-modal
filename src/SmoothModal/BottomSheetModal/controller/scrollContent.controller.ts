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
  const enableScroll = (scrollEnabled: boolean, timeout?: number) => {
    if (timeout)
      setTimeout(
        () =>
          scrollableComponentRef?.current?.setNativeProps({ scrollEnabled }),
        timeout
      );
    else scrollableComponentRef?.current?.setNativeProps({ scrollEnabled });
  };
  const dragEnabled = useSharedValue(false);
  const initDragPos = useSharedValue(0);
  const beginDragInit = useSharedValue(false);

  const scrollEnabled = useSharedValue(true);

  const onBeginScroll: DragGestureProps['onDragStart'] = useCallback((e) => {
    'worklet';
    const maxPositionFromTopToEnableScroll = 15;
    const isPositionFarFromTop = inverted.value
      ? scrollY.value < maxScrollOffset.value - maxPositionFromTopToEnableScroll
      : scrollY.value > maxPositionFromTopToEnableScroll;

    if (isPositionFarFromTop) {
      scrollActive.value = true;
    } else {
      beginDragInit.value = true;
      onDragStartGesture(e);
    }
  }, []);
  const onUpdateScroll: DragGestureProps['onDrag'] = useCallback(
    (e) => {
      'worklet';
      if (scrollActive.value) return;
      if (dragEnabled.value) {
        if (scrollEnabled.value) {
          if (e.translationY < initDragPos.value) {
            scrollEnabled.value = false;
            runOnJS(enableScroll)(false);
          }
          initDragPos.value = e.translationY;
        }
        return onDragGesture(e);
      }
      if (beginDragInit.value) {
        beginDragInit.value = false;
        return;
      }
      if (
        e.translationY > -400 &&
        (inverted.value
          ? Math.round(scrollY.value) >= Math.round(maxScrollOffset.value)
          : scrollY.value <= 0)
      ) {
        if (!dragEnabled.value) {
          initDragPos.value = e.translationY;
          dragEnabled.value = true;
          onDragGesture(e);
        }
      } else if (scrollY.value > 0) {
        scrollActive.value = true;
      }
    },
    [enableScroll]
  );
  const onEndScroll: NonNullable<DragGestureProps['onDragEnd']> = useCallback(
    (e) => {
      'worklet';
      if (!scrollActive.value) {
        onDragEndGesture(e);
        runOnJS(enableScroll)(true);
      } else runOnJS(enableScroll)(true);
      scrollActive.value = false;
      dragEnabled.value = false;
      scrollEnabled.value = true;
    },
    [enableScroll]
  );

  return { onBeginScroll, onUpdateScroll, onEndScroll };
}
