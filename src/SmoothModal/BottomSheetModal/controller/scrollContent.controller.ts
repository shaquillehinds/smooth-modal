//$lf-ignore
import { runOnJS, type SharedValue, withTiming } from 'react-native-reanimated';
import { halfCloseTimingConfig } from '../bottomSheetModal.constants';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { DragGestureProps } from '../../gestures/Drag.gesture';
import type { ScrollComponentRef } from '../bottomSheetModal.types';
import { useCallback } from 'react';

type ScrollContentControllerType = {
  scrollY: SharedValue<number>;
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  maxScrollOffset: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  inverted: SharedValue<boolean>;
  scrollActive: SharedValue<boolean>;
  onDragEndGesture: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onDragGesture: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  scrollableComponentRef?: ScrollComponentRef;
};

export function scrollContentController({
  scrollActive,
  scrollY,
  translationY,
  prevTranslationY,
  backdropOpacity,
  onDragEndGesture,
  onDragGesture,
  maxScrollOffset,
  inverted,
  scrollableComponentRef,
}: ScrollContentControllerType) {
  const enableScroll = (scrollEnabled: boolean) => {
    scrollableComponentRef?.current?.setNativeProps({ scrollEnabled });
  };

  const onBeginScroll = useCallback(() => {
    'worklet';
    const isScrollingDown = inverted.value
      ? scrollY.value < maxScrollOffset.value - 15
      : scrollY.value > 15;
    if (isScrollingDown) {
      scrollActive.value = true;
    }
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
        runOnJS(enableScroll)(false);
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
      if (!scrollActive.value) {
        onDragEndGesture(e);
      } else {
        translationY.value = withTiming(
          prevTranslationY.value,
          halfCloseTimingConfig
        );
        backdropOpacity.value = withTiming(1, halfCloseTimingConfig);
      }
      scrollActive.value = false;
      runOnJS(enableScroll)(true);
    },
    [enableScroll]
  );

  return { onBeginScroll, onUpdateScroll, onEndScroll };
}
